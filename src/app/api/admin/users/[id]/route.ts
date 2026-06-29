import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params; const body = await request.json()
    if (body.password) { const bcrypt = await import("bcryptjs"); body.password = await bcrypt.hash(body.password, 12) }
    const data = await db.update("users", id, body)
    if (!data) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    const { password, ...safe } = data
    return NextResponse.json({ success: true, message: "User diupdate", data: safe })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { id } = await params
    if (id === user.id) return NextResponse.json({ success: false, error: "Tidak bisa hapus sendiri" }, { status: 400 })
    await db.delete("users", id)
    return NextResponse.json({ success: true, message: "User dihapus" })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
