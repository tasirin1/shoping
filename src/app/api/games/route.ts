import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { active: true }

    if (popular === "true") {
      where.popular = true
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: {
          nominals: {
            where: { active: true },
            select: { id: true, name: true, amount: true, price: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.game.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: games,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Games error:", error)
    return NextResponse.json(
      { success: false, error: "Gagal memuat data game" },
      { status: 500 }
    )
  }
}
