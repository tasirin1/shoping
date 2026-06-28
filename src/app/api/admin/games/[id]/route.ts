import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const body = await request.json()
    const game = await prisma.game.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, message: "Game berhasil diupdate", data: game })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update game" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    await prisma.game.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "Game berhasil dihapus" })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal hapus game" }, { status: 500 })
  }
}
