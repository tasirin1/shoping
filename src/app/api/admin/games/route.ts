import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const games = await db.getAll("games")
    const products = await db.getAll("products")
    const orders = await db.getAll("orders")
    const enriched = games.map((g: any) => ({
      ...g,
      _count: { nominals: products.filter((p: any) => p.gameId === g.id).length, orders: orders.filter((o: any) => o.gameId === g.id).length },
    }))
    return NextResponse.json({ success: true, data: enriched })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const data = await db.create("games", { ...body, slug: body.slug?.toLowerCase().replace(/[^a-z0-9-]/g, "-") || body.name?.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
    return NextResponse.json({ success: true, message: "Game ditambahkan", data }, { status: 201 })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
