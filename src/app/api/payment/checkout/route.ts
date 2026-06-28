import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID diperlukan" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        game: { select: { name: true } },
        nominal: { select: { name: true, price: true } },
      },
    })

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ success: false, error: "Pesanan sudah diproses" }, { status: 400 })
    }

    // Mock payment - generate QRIS
    const paymentData = {
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=shoping-payment-${order.invoice}`,
      invoice: order.invoice,
      amount: order.total,
      fee: order.fee,
      gameName: order.game.name,
      nominalName: order.nominal.name,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: "QRIS",
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran siap",
      data: paymentData,
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memproses pembayaran" }, { status: 500 })
  }
}
