import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const code = searchParams.get("code")
    let data = await db.getAll("promos")
    if (active === "true") data = data.filter((p: any) => p.active !== false)
    if (code) data = data.filter((p: any) => p.code === code.toUpperCase())
    return NextResponse.json({ success: true, data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
