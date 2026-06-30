import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params; const body = await request.json()
    const data = await db.update("products", id, body)
    if (!data) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, message: "Nominal diupdate", data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    await db.delete("products", id)
    return NextResponse.json({ success: true, message: "Nominal dihapus" })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
