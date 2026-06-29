import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { orderId } = await request.json()
    if (!orderId) return NextResponse.json({ success: false, error: "Order ID diperlukan" }, { status: 400 })

    const order = await db.getById("orders", orderId)
    if (!order || order.userId !== user.id) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 })
    if (order.status !== "PENDING") return NextResponse.json({ success: false, error: "Pesanan sudah diproses" }, { status: 400 })

    const games = await db.getAll("games")
    const products = await db.getAll("products")
    const game = games.find((g: any) => g.id === order.gameId)
    const nominal = products.find((p: any) => p.id === order.nominalId)

    return NextResponse.json({
      success: true, message: "Pembayaran siap",
      data: {
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=shoping-payment-${order.invoice}`,
        invoice: order.invoice, amount: order.total, fee: order.fee,
        gameName: game?.name || "Game", nominalName: nominal?.name || "Nominal",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: "QRIS",
      },
    })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
