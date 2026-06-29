import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")

    let games = await db.getAll("games")
    games = games.filter((g: any) => g.active !== false)

    if (popular === "true") games = games.filter((g: any) => g.popular === true)
    if (search) games = games.filter((g: any) => g.name.toLowerCase().includes(search.toLowerCase()))

    // Attach nominals/products
    const products = await db.getAll("products")
    games = games.map((g: any) => ({
      ...g,
      nominals: products.filter((p: any) => p.gameId === g.id && p.active !== false),
    }))

    const total = games.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    return NextResponse.json({ success: true, data: games.slice(skip, skip + limit), pagination: { total, page, limit, totalPages } })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat game" }, { status: 500 })
  }
}
