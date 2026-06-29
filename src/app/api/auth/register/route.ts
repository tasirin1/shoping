import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { hashPassword, createSession } from "@/lib/auth"
import { sanitizeInput, isValidEmail, isValidUsername } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { email, username, password, name } = await request.json()
    if (!email || !username || !password) return NextResponse.json({ success: false, error: "Semua field wajib diisi" }, { status: 400 })

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())
    const sanitizedUsername = sanitizeInput(username.trim())

    if (!isValidEmail(sanitizedEmail)) return NextResponse.json({ success: false, error: "Format email tidak valid" }, { status: 400 })
    if (!isValidUsername(sanitizedUsername)) return NextResponse.json({ success: false, error: "Username 3-20 karakter" }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ success: false, error: "Password minimal 6 karakter" }, { status: 400 })

    const existing = await db.findFirstOr("users", [{ email: sanitizedEmail }, { username: sanitizedUsername }])
    if (existing) {
      const field = existing.email === sanitizedEmail ? "Email" : "Username"
      return NextResponse.json({ success: false, error: `${field} sudah terdaftar` }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const user = await db.create("users", { email: sanitizedEmail, username: sanitizedUsername, password: hashed, name: name ? sanitizeInput(name.trim()) : null, role: "USER", phone: "", avatar: "", suspended: false })

    await createSession(user.id)
    return NextResponse.json({ success: true, message: "Registrasi berhasil", data: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role } })
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
