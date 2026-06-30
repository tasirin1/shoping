import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"
import { DEFAULT_THEME } from "@/lib/theme"
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

async function resetThemeToDefaults(): Promise<void> {
  const allSettings = await db.getAll("settings")
  const toDelete = allSettings.filter((s: any) => s.key.startsWith(THEME_PREFIX))
  for (const setting of toDelete) {
    await db.delete("settings", setting.id)
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    const config = await getThemeConfig()
    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("Theme GET error:", error)
    return NextResponse.json({ success: false, error: "Gagal memuat tema" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    const body = await request.json()
    await saveThemeConfig(body)
    await createAuditLog("UPDATE", "theme", null, "Memperbarui tema website")
    return NextResponse.json({ success: true, message: "Tema disimpan" })
  } catch (error) {
    console.error("Theme PUT error:", error)
    return NextResponse.json({ success: false, error: "Gagal menyimpan tema" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    await resetThemeToDefaults()
    await createAuditLog("RESET", "theme", null, "Mereset tema ke default")
    return NextResponse.json({ success: true, data: DEFAULT_THEME, message: "Tema direset ke default" })
  } catch (error) {
    console.error("Theme DELETE error:", error)
    return NextResponse.json({ success: false, error: "Gagal mereset tema" }, { status: 500 })
  }
}
