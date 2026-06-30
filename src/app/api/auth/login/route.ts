import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyPassword, createSession } from "@/lib/auth"
import { createAuditLogWithUser } from "@/lib/audit"
import { rateLimitKey, rateLimitResponse } from "@/lib/rate-limiter"
import { validateFields } from "@/lib/validate"
import type { ValidationField } from "@/lib/validate"

const loginFields: ValidationField[] = [
  { key: "username", label: "Username", type: "string", required: true, minLength: 4, maxLength: 20, pattern: /^[a-zA-Z0-9_]+$/, patternMessage: "Username hanya boleh huruf, angka, dan underscore", sanitize: true },
  { key: "password", label: "Password", type: "string", required: true, minLength: 6, maxLength: 128, sanitize: false },
]

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const identifier = body?.username || ip

    // Rate limit: 5 attempts per minute per username
    const rl = rateLimitResponse(rateLimitKey(identifier, "login"), "strict")
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
        { status: 429, headers: rl.headers }
      )
    }

    // Validate input
    const validation = validateFields(body || {}, loginFields)
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400, headers: rl.headers }
      )
    }

    const { username, password } = validation.sanitized as { username: string; password: string }
    const sanitizedUsername = (username as string).toLowerCase().trim()

    // Find user by username (case-insensitive)
    const users = await db.getAll("users")
    const user = users.find(
      (u: any) => u.username?.toLowerCase() === sanitizedUsername
    )

    if (!user || user.suspended) {
      // Generic error — don't reveal whether username exists or account is suspended
      return NextResponse.json(
        { success: false, error: "Username atau password salah" },
        { status: 401, headers: rl.headers }
      )
    }

    const isValid = await verifyPassword(password as string, user.password)
    if (!isValid) {
      // Log failed attempt
      await createAuditLogWithUser(user.id, "LOGIN_FAILED", "auth", user.id, "Password salah", ip)
      return NextResponse.json(
        { success: false, error: "Username atau password salah" },
        { status: 401, headers: rl.headers }
      )
    }

    await createSession(user.id)

    // Log successful login
    await createAuditLogWithUser(user.id, "LOGIN_SUCCESS", "auth", user.id, "Login berhasil", ip)

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }, { headers: rl.headers })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
