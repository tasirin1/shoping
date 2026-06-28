import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    const games = await prisma.game.findMany({
      include: { _count: { select: { orders: true, nominals: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: games })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    const body = await request.json()
    const { name, slug, description, icon, banner, thumbnail, category, popular } = body
    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Nama dan slug wajib diisi" }, { status: 400 })
    }
    const game = await prisma.game.create({
      data: { name, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"), description, icon, banner, thumbnail, category, popular: popular || false },
    })
    return NextResponse.json({ success: true, message: "Game berhasil ditambahkan", data: game }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah game" }, { status: 500 })
  }
}
