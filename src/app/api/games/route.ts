import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: any = { active: true }
    if (popular === "true") where.popular = true
    if (search) where.name = { contains: search, mode: "insensitive" }
    if (category) where.OR = [{ category }, { categoryId: category }]

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: { nominals: { where: { active: true }, select: { id: true, name: true, amount: true, price: true } }, categoryRel: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: limit, skip,
      }),
      prisma.game.count({ where }),
    ])

    return NextResponse.json({
      success: true, data: games,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat game" }, { status: 500 })
  }
}
