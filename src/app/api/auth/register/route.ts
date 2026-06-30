import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { hashPassword, createSession } from "@/lib/auth"
import { createAuditLogWithUser } from "@/lib/audit"
import { rateLimitKey, rateLimitResponse } from "@/lib/rate-limiter"
import { validateFields } from "@/lib/validate"
import type { ValidationField } from "@/lib/validate"

const registerFields: ValidationField[] = [
  { key: "email", label: "Email", type: "email", required: true, maxLength: 255 },
  { key: "username", label: "Username", type: "string", required: true, minLength: 3, maxLength: 20, pattern: /^[a-zA-Z0-9_]+$/, patternMessage: "Username hanya boleh huruf, angka, dan underscore" },
  { key: "password", label: "Password", type: "string", required: true, minLength: 6, maxLength: 128, sanitize: false },
  { key: "name", label: "Nama", type: "string", required: false, maxLength: 100 },
]

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const identifier = body?.email || ip

    // Rate limit check
    const rl = rateLimitResponse(rateLimitKey(identifier, "register"), "strict")
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429, headers: rl.headers }
      )
    }

    // Validate input
    const validation = validateFields(body || {}, registerFields)
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400, headers: rl.headers }
      )
    }

    const { email, username, password, name } = validation.sanitized as {
      email: string
      username: string
      password: string
      name?: string | null
    }

    // Check for existing user
    const existing = await db.findFirstOr("users", [
      { email } as any,
      { username } as any,
    ])
    if (existing) {
      const field = existing.email === email ? "Email" : "Username"
      return NextResponse.json(
        { success: false, error: `${field} sudah terdaftar` },
        { status: 409, headers: rl.headers }
      )
    }

    const hashed = await hashPassword(password)
    const user = await db.create("users", {
      email: email as string,
      username: username as string,
      password: hashed,
      name: name ? (name as string) : null,
      role: "USER",
      phone: "",
      avatar: "",
      suspended: false,
    })

    await createSession(user.id)

    // Log registration
    await createAuditLogWithUser(user.id, "REGISTER", "auth", user.id, "Registrasi akun baru", ip)

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    }, { headers: rl.headers })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
