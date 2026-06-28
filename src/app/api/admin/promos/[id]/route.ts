import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const body = await request.json()
    const promo = await prisma.promo.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, message: "Promo berhasil diupdate", data: promo })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update promo" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    await prisma.promo.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "Promo berhasil dihapus" })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal hapus promo" }, { status: 500 })
  }
}
