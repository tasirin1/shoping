import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const categories = await db.getAll("categories")
    const games = await db.getAll("games")
    const enriched = categories.map((c: any) => ({ ...c, _count: { games: games.filter((g: any) => g.categoryId === c.id).length } }))
    return NextResponse.json({ success: true, data: enriched })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const data = await db.create("categories", body)
    return NextResponse.json({ success: true, message: "Kategori ditambahkan", data }, { status: 201 })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
