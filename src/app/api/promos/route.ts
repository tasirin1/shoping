import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const code = searchParams.get("code")

    const where: Record<string, unknown> = {}
    if (active === "true") where.active = true
    if (code) where.code = code.toUpperCase()

    const promos = await prisma.promo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: promos })
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat promo" },
      { status: 500 }
    )
  }
}
