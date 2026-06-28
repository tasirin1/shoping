import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { position: "asc" },
    })

    return NextResponse.json({ success: true, data: banners })
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal memuat banner" },
      { status: 500 }
    )
  }
}
