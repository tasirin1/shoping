import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")
    let products = await db.getAll("products")
    if (gameId) products = products.filter((p: any) => p.gameId === gameId && p.active !== false)
    const games = await db.getAll("games")
    const enriched = products.map((p: any) => ({ ...p, game: games.find((g: any) => g.id === p.gameId) || null }))
    return NextResponse.json({ success: true, data: enriched })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
