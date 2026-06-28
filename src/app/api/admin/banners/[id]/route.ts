import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const body = await request.json()
    const banner = await prisma.banner.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, message: "Banner berhasil diupdate", data: banner })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "Banner berhasil dihapus" })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal hapus banner" }, { status: 500 })
  }
}
