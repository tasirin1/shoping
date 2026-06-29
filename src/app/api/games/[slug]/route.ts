import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const game = await prisma.game.findUnique({
      where: { slug },
      include: { nominals: { where: { active: true }, orderBy: { price: "asc" } }, categoryRel: true },
    })
    if (!game) return NextResponse.json({ success: false, error: "Game tidak ditemukan" }, { status: 404 })
    return NextResponse.json({ success: true, data: game })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
