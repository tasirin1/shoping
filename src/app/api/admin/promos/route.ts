import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const promos = await prisma.promo.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ success: true, data: promos })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const promo = await prisma.promo.create({ data: { ...body, code: body.code.toUpperCase() } })
    return NextResponse.json({ success: true, message: "Promo berhasil ditambahkan", data: promo }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah promo" }, { status: 500 })
  }
}
