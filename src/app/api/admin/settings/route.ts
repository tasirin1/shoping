import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const settings = await db.getAll("settings")
    const map: Record<string, string> = {}
    settings.forEach((s: any) => { map[s.key] = s.value })
    return NextResponse.json({ success: true, data: map })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.findOne("settings", "key", key)
      if (existing) await db.update("settings", existing.id, { value: String(value) })
      else await db.create("settings", { key, value: String(value) })
    }
    await createAuditLog("UPDATE", "settings", null, "Mengupdate pengaturan website")
    return NextResponse.json({ success: true, message: "Pengaturan disimpan" })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
