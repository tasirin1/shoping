import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { generateInvoice, sanitizeInput } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId: user.id }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          game: { select: { id: true, name: true, slug: true, icon: true } },
          nominal: { select: { id: true, name: true, price: true } },
          paymentMethod: { select: { id: true, name: true, icon: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat pesanan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu" }, { status: 401 })
    }

    const body = await request.json()
    const { gameId, nominalId, paymentMethodId, playerId } = body

    if (!gameId || !nominalId || !playerId) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
    }

    const sanitizedPlayerId = sanitizeInput(playerId.trim())
    if (!sanitizedPlayerId) {
      return NextResponse.json({ success: false, error: "Player ID tidak valid" }, { status: 400 })
    }

    const nominal = await prisma.nominal.findUnique({
      where: { id: nominalId },
      include: { game: true },
    })

    if (!nominal || !nominal.active) {
      return NextResponse.json({ success: false, error: "Nominal tidak tersedia" }, { status: 404 })
    }

    if (nominal.gameId !== gameId) {
      return NextResponse.json({ success: false, error: "Data tidak valid" }, { status: 400 })
    }

    const fee = Math.round(nominal.price * 0.01)
    const total = nominal.price + fee

    const invoice = generateInvoice()

    const order = await prisma.order.create({
      data: {
        invoice,
        userId: user.id,
        gameId,
        nominalId,
        paymentMethodId,
        playerId: sanitizedPlayerId,
        amount: nominal.price,
        fee,
        total,
        status: "PENDING",
      },
      include: {
        game: { select: { name: true, slug: true, icon: true } },
        nominal: { select: { name: true, price: true } },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat",
      data: order,
    }, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ success: false, error: "Gagal membuat pesanan" }, { status: 500 })
  }
}
