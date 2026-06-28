import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      pendingOrders,
      successOrders,
      recentOrders,
      popularGamesRaw,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "SUCCESS" } }),
      prisma.user.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "SUCCESS" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          game: { select: { name: true } },
          user: { select: { username: true } },
        },
      }),
      prisma.order.groupBy({
        by: ["gameId"],
        _count: { id: true },
        _sum: { total: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ])

    const gameIds = popularGamesRaw.map((g) => g.gameId)
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    })
    const gameMap = new Map(games.map((g) => [g.id, g.name]))

    const popularGames = popularGamesRaw.map((g) => ({
      name: gameMap.get(g.gameId) || "Unknown",
      count: g._count.id,
      revenue: g._sum.total || 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalUsers,
        pendingOrders,
        successOrders,
        recentOrders,
        popularGames,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat statistik" }, { status: 500 })
  }
}
