import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true, message: "Logout berhasil" })
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 })
  }
}
