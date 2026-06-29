import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const data = await prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } })
    return NextResponse.json({ success: true, data })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
