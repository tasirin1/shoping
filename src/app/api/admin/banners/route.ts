import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const banners = await prisma.banner.findMany({ orderBy: { position: "asc" } })
    return NextResponse.json({ success: true, data: banners })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const banner = await prisma.banner.create({ data: body })
    return NextResponse.json({ success: true, message: "Banner berhasil ditambahkan", data: banner }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal menambah banner" }, { status: 500 })
  }
}
