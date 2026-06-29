import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    let users = await db.getAll("users")
    if (search) users = users.filter((u: any) => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    const orders = await db.getAll("orders")
    const enriched = users.map((u: any) => {
      const { password, ...safe } = u
      return { ...safe, _count: { orders: orders.filter((o: any) => o.userId === u.id).length } }
    })
    return NextResponse.json({ success: true, data: enriched })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
