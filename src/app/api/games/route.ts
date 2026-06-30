import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.toLowerCase()
    const popular = searchParams.get("popular")
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")

    const games = await db.getAll("games")
    const products = await db.getAll("products")

    let filtered = games.filter((g: any) => g.active !== false)

    // Filter by slug
    if (slug) filtered = filtered.filter((g: any) => g.slug === slug)

    // Search
    if (search) filtered = filtered.filter((g: any) =>
      g.name?.toLowerCase().includes(search) ||
      g.categoryName?.toLowerCase().includes(search)
    )

    // Popular
    if (popular === "true") {
      filtered = filtered.filter((g: any) => g.popular === true)
    }

    // Category
    if (category) {
      filtered = filtered.filter((g: any) => g.categoryName?.toLowerCase() === category.toLowerCase())
    }

    // Attach nominals
    const enriched = filtered.map((g: any) => ({
      ...g,
      nominals: products.filter((p: any) => p.gameId === g.id && p.active !== false),
    }))

    // Sort by sortOrder
    enriched.sort((a: any, b: any) => (a.sortOrder || 999) - (b.sortOrder || 999))

    const total = enriched.length
    const skip = (page - 1) * limit
    const paged = enriched.slice(skip, skip + limit)

    const response = NextResponse.json({
      success: true,
      data: paged,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Cache for 60 seconds on public endpoints
    if (!search && !slug) {
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120")
    }

    return response
  } catch (error) {
    console.error("Games API error:", error)
    return NextResponse.json({ success: false, error: "Gagal memuat game" }, { status: 500 })
  }
}
