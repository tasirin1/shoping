import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const data = await db.getAll("promos")
    return NextResponse.json({ success: true, data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const data = await db.create("promos", body)
    return NextResponse.json({ success: true, message: "Ditambahkan", data }, { status: 201 })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
