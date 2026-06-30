import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { hashPassword, createSession } from "@/lib/auth"
import { createAuditLogWithUser } from "@/lib/audit"
import { rateLimitKey, rateLimitResponse } from "@/lib/rate-limiter"
import { validateFields } from "@/lib/validate"
import type { ValidationField } from "@/lib/validate"

// Registration fields
const registerFields: ValidationField[] = [
  {
    key: "username", label: "Username", type: "string", required: true,
    minLength: 4, maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    patternMessage: "Username hanya boleh huruf, angka, dan underscore (4-20 karakter)",
    sanitize: true,
  },
  {
    key: "password", label: "Password", type: "string", required: true,
    minLength: 6, maxLength: 128, sanitize: false,
  },
  {
    key: "email", label: "Email", type: "email", required: false,
    maxLength: 255,
  },
]

const REG_LIMIT_KEY = "reg_ip_log"

async function getRegLog(): Promise<Record<string, number[]>> {
  const stored = await db.findOne("settings", "key", REG_LIMIT_KEY)
  if (stored) {
    try { return JSON.parse(stored.value) } catch { return {} }
  }
  return {}
}

async function saveRegLog(log: Record<string, number[]>): Promise<void> {
  const existing = await db.findOne("settings", "key", REG_LIMIT_KEY)
  const value = JSON.stringify(log)
  if (existing) await db.update("settings", existing.id, { value })
  else await db.create("settings", { key: REG_LIMIT_KEY, value })
}

function cleanupOldEntries(log: Record<string, number[]>, maxAge: number): Record<string, number[]> {
  const now = Date.now()
  const result: Record<string, number[]> = {}
  for (const [ip, timestamps] of Object.entries(log)) {
    const recent = timestamps.filter((ts) => now - ts < maxAge)
    if (recent.length > 0) result[ip] = recent
  }
  return result
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Rate limit: strict check for register endpoint
    const rl = rateLimitResponse(rateLimitKey(`register:${ip}`, "register"), "strict")
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429, headers: rl.headers }
      )
    }

    // IP-based registration limit: max 2 accounts per IP per 24 hours
    const regLog = await getRegLog()
    const cleaned = cleanupOldEntries(regLog, 24 * 60 * 60 * 1000)
    const userRegs = cleaned[ip] || []
    if (userRegs.length >= 2) {
      return NextResponse.json(
        { success: false, error: "Batas pembuatan akun dari jaringan ini telah tercapai. Silakan coba lagi setelah 24 jam." },
        { status: 429 }
      )
    }

    // Validate input
    const validation = validateFields(body || {}, registerFields)
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      )
    }

    const sanitized = validation.sanitized as {
      username: string
      password: string
      email?: string | null
    }

    const username = (sanitized.username as string).trim()
    const password = sanitized.password as string
    const email = sanitized.email as string | null

    // Check username uniqueness (case-insensitive)
    const allUsers = await db.getAll("users")
    const existing = allUsers.find(
      (u: any) => u.username?.toLowerCase() === username.toLowerCase()
    )
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Username sudah terdaftar" },
        { status: 409 }
      )
    }

    // Check email uniqueness if provided
    if (email) {
      const emailExists = allUsers.find(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      )
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Email sudah terdaftar" },
          { status: 409 }
        )
      }
    }

    const hashed = await hashPassword(password)
    const user = await db.create("users", {
      username,
      email: email || undefined,
      password: hashed,
      name: null,
      role: "USER",
      phone: "",
      avatar: "",
      suspended: false,
    })

    // Log successful registration for IP tracking
    if (!cleaned[ip]) cleaned[ip] = []
    cleaned[ip].push(Date.now())
    await saveRegLog(cleaned)

    await createSession(user.id)

    // Log registration
    await createAuditLogWithUser(user.id, "REGISTER", "auth", user.id, "Registrasi akun baru", ip)

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
