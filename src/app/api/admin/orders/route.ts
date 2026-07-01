import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "15")
    const status = searchParams.get("status")

    let orders = await db.getAll("orders")
    if (status) orders = orders.filter((o: any) => o.status === status)

    const games = await db.getAll("games")
    const users = await db.getAll("users")
    const products = await db.getAll("products")

    orders = orders.map((o: any) => ({
      ...o, game: games.find((g: any) => g.id === o.gameId) || null,
      user: users.find((u: any) => u.id === o.userId) || null,
      nominal: products.find((p: any) => p.id === o.nominalId) || null,
    }))

    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    orders.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1))
    const skip = (page - 1) * limit

    return NextResponse.json({ success: true, data: orders.slice(skip, skip + limit), pagination: { total, page, limit, totalPages } })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
