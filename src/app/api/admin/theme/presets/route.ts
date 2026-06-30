import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"
import { THEME_PRESETS, getPreset, applyPreset, DEFAULT_THEME } from "@/lib/theme"
import type { ThemeConfig } from "@/types"

const THEME_PREFIX = "theme_"

async function getThemeConfig(): Promise<ThemeConfig> {
  const allSettings = await db.getAll("settings")
  const themeSettings: Record<string, string> = {}
  allSettings.forEach((s: any) => {
    if (s.key.startsWith(THEME_PREFIX)) themeSettings[s.key] = s.value
  })
  const config: Record<string, string> = {}
  for (const [key, value] of Object.entries(DEFAULT_THEME)) {
    const stored = themeSettings[`${THEME_PREFIX}${key}`]
    config[key] = stored !== undefined ? stored : (value as string)
  }
  return config as unknown as ThemeConfig
}

async function saveThemeConfig(config: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) continue
    const prefixed = `${THEME_PREFIX}${key}`
    const existing = await db.findOne("settings", "key", prefixed)
    if (existing) {
      await db.update("settings", existing.id, { value: String(value) })
    } else {
      await db.create("settings", { key: prefixed, value: String(value) })
    }
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ success: true, data: THEME_PRESETS })
  } catch (error) {
    console.error("Presets GET error:", error)
    return NextResponse.json({ success: false, error: "Gagal memuat preset" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    const { preset: slug } = await request.json()
    const preset = getPreset(slug as any)
    if (!preset) {
      return NextResponse.json({ success: false, error: "Preset tidak ditemukan" }, { status: 404 })
    }
    const current = await getThemeConfig()
    const applied = applyPreset(current, preset)
    await saveThemeConfig(applied as any)
    await createAuditLog("APPLY_PRESET", "theme", null, `Menerapkan preset tema: ${preset.name}`)
    return NextResponse.json({ success: true, data: applied, message: `Tema "${preset.name}" diterapkan` })
  } catch (error) {
    console.error("Presets POST error:", error)
    return NextResponse.json({ success: false, error: "Gagal menerapkan preset" }, { status: 500 })
  }
}
