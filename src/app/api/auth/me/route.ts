import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    return NextResponse.json({ success: true, data: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone, createdAt: user.createdAt } })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
