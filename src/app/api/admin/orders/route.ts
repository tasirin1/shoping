import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { game: { select: { name: true } }, user: { select: { username: true } }, nominal: { select: { name: true } } },
        orderBy: { createdAt: "desc" }, take: limit, skip,
      }),
      prisma.order.count({ where }),
    ])
    return NextResponse.json({ success: true, data: orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat pesanan" }, { status: 500 })
  }
}
