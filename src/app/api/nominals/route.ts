import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")

    const where: Record<string, unknown> = { active: true }
    if (gameId) where.gameId = gameId

    const nominals = await prisma.nominal.findMany({
      where,
      include: {
        game: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { price: "asc" },
    })

    return NextResponse.json({ success: true, data: nominals })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat nominal" }, { status: 500 })
  }
}
