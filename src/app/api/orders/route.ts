import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { sanitizeInput } from "@/lib/utils"

export const dynamic = "force-dynamic"

function generateInvoice(): string {
  const date = new Date()
  const d = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0")
  const r = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV/${d}/${r}`
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    let orders = await db.getAll("orders")
    orders = orders.filter((o: any) => o.userId === user.id)
    if (status) orders = orders.filter((o: any) => o.status === status)

    // Attach related data
    const games = await db.getAll("games")
    const products = await db.getAll("products")
    const payments = await db.getAll("payments")

    orders = orders.map((o: any) => ({
      ...o,
      game: games.find((g: any) => g.id === o.gameId) || null,
      nominal: products.find((p: any) => p.id === o.nominalId) || null,
      paymentMethod: payments.find((p: any) => p.id === o.paymentMethodId) || null,
    }))

    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    orders.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1))

    return NextResponse.json({ success: true, data: orders.slice(skip, skip + limit), pagination: { total, page, limit, totalPages } })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: "Silakan login" }, { status: 401 })

    const { gameId, nominalId, paymentMethodId, playerId } = await request.json()
    if (!gameId || !nominalId || !playerId) return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })

    const sanitizedPID = sanitizeInput(playerId.trim())
    if (!sanitizedPID) return NextResponse.json({ success: false, error: "Player ID tidak valid" }, { status: 400 })

    const products = await db.getAll("products")
    const nominal = products.find((p: any) => p.id === nominalId && p.active !== false)
    if (!nominal) return NextResponse.json({ success: false, error: "Nominal tidak tersedia" }, { status: 404 })

    const fee = Math.round(nominal.price * 0.01)
    const total = nominal.price + fee
    const invoice = generateInvoice()

    const order = await db.create("orders", {
      invoice, userId: user.id, gameId, nominalId, paymentMethodId: paymentMethodId || null,
      playerId: sanitizedPID, amount: nominal.price, fee, total, status: "PENDING",
      playerNickname: null, paymentProof: null, promoCode: null, discountAmount: 0, note: null,
    })

    return NextResponse.json({ success: true, message: "Pesanan dibuat", data: order }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
