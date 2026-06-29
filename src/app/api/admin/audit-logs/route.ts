import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const result = await db.paginate("logs", page, limit)
    const users = await db.getAll("users")
    result.data = result.data.map((l: any) => ({ ...l, user: users.find((u: any) => u.id === l.userId) || null }))
    return NextResponse.json({ success: true, ...result })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
