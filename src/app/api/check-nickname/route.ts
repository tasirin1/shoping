import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { playerId } = await request.json()
    if (!playerId) return NextResponse.json({ success: false, error: "Player ID diperlukan" }, { status: 400 })
    await new Promise((r) => setTimeout(r, 800))
    const nicknames = ["NarutoXS", "ShadowHunter", "Bryan_99", "QueenBee", "HeadShotPro", "GarenaLord"]
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)]
    return NextResponse.json({ success: true, data: { playerId: playerId.trim(), nickname: `${nickname}_${playerId.slice(-4)}` } })
  } catch { return NextResponse.json({ success: false, error: "Error" }, { status: 500 }) }
}
