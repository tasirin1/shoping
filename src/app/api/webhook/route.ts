import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invoice, status } = body

    if (!invoice || !status) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
    }

    const validStatuses = ["SUCCESS", "FAILED", "EXPIRED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Status tidak valid" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { invoice },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { status }
    if (status === "SUCCESS") {
      updateData.paidAt = new Date()
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData as any,
    })

    return NextResponse.json({
      success: true,
      message: `Pembayaran ${status === "SUCCESS" ? "berhasil" : "gagal"}`,
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memproses webhook" }, { status: 500 })
  }
}
