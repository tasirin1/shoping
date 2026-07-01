import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await db.getAll("banners")
    return NextResponse.json({ success: true, data: data.filter((b: any) => b.active !== false).sort((a: any, b: any) => a.position - b.position) })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
