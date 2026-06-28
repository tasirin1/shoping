import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id }, include: { game: true, user: true, nominal: true, paymentMethod: true } })
    if (!order) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 })
    return NextResponse.json({ success: true, data: order })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat pesanan" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const body = await request.json()
    const order = await prisma.order.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, message: "Pesanan berhasil diupdate", data: order })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update pesanan" }, { status: 500 })
  }
}
