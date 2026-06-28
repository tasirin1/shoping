import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const body = await request.json()
    const { password, ...rest } = body
    const data: Record<string, unknown> = { ...rest }
    if (password) {
      const bcrypt = await import("bcryptjs")
      data.password = await bcrypt.hash(password, 12)
    }
    const updated = await prisma.user.update({ where: { id }, data, select: { id: true, email: true, username: true, name: true, role: true, phone: true, createdAt: true } })
    return NextResponse.json({ success: true, message: "User berhasil diupdate", data: updated })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    if (id === user.id) return NextResponse.json({ success: false, error: "Tidak bisa menghapus akun sendiri" }, { status: 400 })
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "User berhasil dihapus" })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal hapus user" }, { status: 500 })
  }
}
