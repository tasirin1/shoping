import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const data = await db.getAll("categories")
    return NextResponse.json({ success: true, data: data.filter((c: any) => c.active !== false) })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
