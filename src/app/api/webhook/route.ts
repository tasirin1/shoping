import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { invoice, status } = await request.json()
    if (!invoice || !status) return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
    if (!["SUCCESS", "FAILED", "EXPIRED"].includes(status)) return NextResponse.json({ success: false, error: "Status tidak valid" }, { status: 400 })

    const order = await db.findOne("orders", "invoice", invoice)
    if (!order) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 })

    const update: any = { status }
    if (status === "SUCCESS") update.paidAt = new Date().toISOString()
    await db.update("orders", order.id, update)

    return NextResponse.json({ success: true, message: `Pembayaran ${status === "SUCCESS" ? "berhasil" : "gagal"}` })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
