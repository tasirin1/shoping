import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameId, playerId } = body

    if (!playerId) {
      return NextResponse.json({ success: false, error: "Player ID diperlukan" }, { status: 400 })
    }

    // Mock nickname checker
    const mockNicknames: Record<string, string[]> = {
      ml: ["NarutoXS", "ShadowHunter", "Bryan_99", "QueenBee"],
      ff: ["HeadShotPro", "GarenaLord", "DarkSniper"],
      pubg: ["PanzerKing", "BattleMaster", "SniperElite"],
    }

    const nicknames = mockNicknames[gameId || "ml"] || mockNicknames.ml
    const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      data: {
        playerId: playerId.trim(),
        nickname: `${randomNickname}_${playerId.slice(-4)}`,
        gameId: gameId || "ml",
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Gagal cek nickname" }, { status: 500 })
  }
}
