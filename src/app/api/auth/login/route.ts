import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyPassword, createSession } from "@/lib/auth"
import { createAuditLogWithUser } from "@/lib/audit"
import { rateLimitKey, rateLimitResponse } from "@/lib/rate-limiter"
import { validateFields } from "@/lib/validate"
import type { ValidationField } from "@/lib/validate"

const loginFields: ValidationField[] = [
  { key: "email", label: "Email", type: "email", required: true, maxLength: 255 },
  { key: "password", label: "Password", type: "string", required: true, minLength: 6, maxLength: 128, sanitize: false },
]

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const identifier = body?.email || ip

    // Rate limit check
    const rl = rateLimitResponse(rateLimitKey(identifier, "login"), "strict")
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan login. Coba lagi nanti." },
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

    const { email, password } = validation.sanitized as { email: string; password: string }
    const sanitizedEmail = email as string

    const user = await db.findOne("users", "email", sanitizedEmail)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401, headers: rl.headers }
      )
    }

    if (user.suspended) {
      await createAuditLogWithUser(user.id, "LOGIN_FAILED", "auth", user.id, "Akun dinonaktifkan", ip)
      return NextResponse.json(
        { success: false, error: "Akun telah dinonaktifkan. Hubungi admin." },
        { status: 403, headers: rl.headers }
      )
    }

    const isValid = await verifyPassword(password as string, user.password)
    if (!isValid) {
      await createAuditLogWithUser(user.id, "LOGIN_FAILED", "auth", user.id, "Password salah", ip)
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
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
        email: user.email,
        username: user.username,
        name: user.name,
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
