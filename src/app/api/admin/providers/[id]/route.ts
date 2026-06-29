import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params; const body = await request.json()
    const data = await prisma.provider.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, message: "Provider diupdate", data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    await prisma.provider.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "Provider dihapus" })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
