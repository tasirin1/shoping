import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ success: false, error: "Email dan password wajib diisi" }, { status: 400 })

    const user = await db.findOne("users", "email", email.toLowerCase().trim())
    if (!user) return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 })
    if (user.suspended) return NextResponse.json({ success: false, error: "Akun telah dinonaktifkan" }, { status: 403 })

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) return NextResponse.json({ success: false, error: "Email atau password salah" }, { status: 401 })

    await createSession(user.id)
    return NextResponse.json({ success: true, message: "Login berhasil", data: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
