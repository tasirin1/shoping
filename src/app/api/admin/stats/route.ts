import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

    const orders = await db.getAll("orders")
    const allUsers = await db.getAll("users")
    const games = await db.getAll("games")

    const totalOrders = orders.length
    const totalRevenue = orders.filter((o: any) => o.status === "SUCCESS").reduce((sum: number, o: any) => sum + (o.total || 0), 0)
    const totalUsers = allUsers.length
    const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length
    const successOrders = orders.filter((o: any) => o.status === "SUCCESS").length

    // Recent orders
    const recentOrders = orders.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1)).slice(0, 10)
    const enrichedRecent = recentOrders.map((o: any) => ({ ...o, game: games.find((g: any) => g.id === o.gameId) || null, user: allUsers.find((u: any) => u.id === o.userId) || null }))

    // Popular games
    const gameCounts: Record<string, { count: number; revenue: number }> = {}
    orders.filter((o: any) => o.status === "SUCCESS").forEach((o: any) => {
      const g = o.gameId
      if (!g) return
      if (!gameCounts[g]) gameCounts[g] = { count: 0, revenue: 0 }
      gameCounts[g].count++
      gameCounts[g].revenue += o.total || 0
    })
    const popularGames = Object.entries(gameCounts)
      .map(([id, val]) => ({ name: games.find((g: any) => g.id === id)?.name || "Unknown", ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({ success: true, data: { totalOrders, totalRevenue, totalUsers, pendingOrders, successOrders, recentOrders: enrichedRecent, popularGames } })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
