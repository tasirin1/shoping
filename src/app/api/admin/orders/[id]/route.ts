import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    const order = await db.getById("orders", id)
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    const games = await db.getAll("games")
    const users = await db.getAll("users")
    const products = await db.getAll("products")
    order.game = games.find((g: any) => g.id === order.gameId) || null
    order.user = users.find((u: any) => u.id === order.userId) || null
    order.nominal = products.find((p: any) => p.id === order.nominalId) || null
    return NextResponse.json({ success: true, data: order })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params; const body = await request.json()
    const data = await db.update("orders", id, body)
    return NextResponse.json({ success: true, message: "Pesanan diupdate", data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
