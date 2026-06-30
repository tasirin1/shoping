import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const products = await db.getAll("products")
    const games = await db.getAll("games")
    const enriched = products.map((p: any) => ({ ...p, game: games.find((g: any) => g.id === p.gameId) || null }))
    return NextResponse.json({ success: true, data: enriched })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const data = await db.create("products", body)
    return NextResponse.json({ success: true, message: "Nominal ditambahkan", data }, { status: 201 })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
