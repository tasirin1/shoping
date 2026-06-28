import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ success: true, data: methods })
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat metode pembayaran" },
      { status: 500 }
    )
  }
}
