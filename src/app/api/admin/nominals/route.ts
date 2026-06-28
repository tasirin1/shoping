import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const nominals = await prisma.nominal.findMany({ include: { game: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } })
    return NextResponse.json({ success: true, data: nominals })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const { gameId, name, amount, price, originalPrice } = body
    if (!gameId || !name || !amount || !price) return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
    const nominal = await prisma.nominal.create({ data: { gameId, name, amount: parseInt(amount), price: parseFloat(price), originalPrice: originalPrice ? parseFloat(originalPrice) : null } })
    return NextResponse.json({ success: true, message: "Nominal berhasil ditambahkan", data: nominal }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah nominal" }, { status: 500 })
  }
}
