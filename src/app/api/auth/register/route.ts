import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, createSession } from "@/lib/auth"
import { sanitizeInput, isValidEmail, isValidUsername } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, password, name } = body

    // Validasi input
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      )
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())
    const sanitizedUsername = sanitizeInput(username.trim())

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      )
    }

    if (!isValidUsername(sanitizedUsername)) {
      return NextResponse.json(
        { success: false, error: "Username harus 3-20 karakter (huruf, angka, underscore)" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal 6 karakter" },
        { status: 400 }
      )
    }

    // Cek duplikasi
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: sanitizedEmail },
          { username: sanitizedUsername },
        ],
      },
    })

    if (existingUser) {
      const field = existingUser.email === sanitizedEmail ? "Email" : "Username"
      return NextResponse.json(
        { success: false, error: `${field} sudah terdaftar` },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        username: sanitizedUsername,
        password: hashedPassword,
        name: name ? sanitizeInput(name.trim()) : null,
      },
    })

    await createSession(user.id)

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
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
