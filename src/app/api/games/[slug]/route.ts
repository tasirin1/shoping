import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const game = await db.findOne("games", "slug", slug)
    if (!game) return NextResponse.json({ success: false, error: "Game tidak ditemukan" }, { status: 404 })

    const products = await db.getAll("products")
    game.nominals = products.filter((p: any) => p.gameId === game.id && p.active !== false)

    return NextResponse.json({ success: true, data: game })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
