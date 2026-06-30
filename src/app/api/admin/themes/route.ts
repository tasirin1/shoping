import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { db } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { createAuditLog } from "@/lib/audit"
import { ALL_BUILTIN_THEMES, cloneTheme, defaultThemeId } from "@/lib/theme"
import type { ThemeRecord } from "@/types"

const THEMES_KEY = "theme_library"
const ACTIVE_KEY = "theme_active_id"

async function getThemeLibrary(): Promise<ThemeRecord[]> {
  const stored = await db.findOne("settings", "key", THEMES_KEY)
  if (stored) {
    try {
      return JSON.parse(stored.value)
    } catch {
      return []
    }
  }
  return []
}

async function saveThemeLibrary(themes: ThemeRecord[]): Promise<void> {
  const existing = await db.findOne("settings", "key", THEMES_KEY)
  const value = JSON.stringify(themes)
  if (existing) {
    await db.update("settings", existing.id, { value })
  } else {
    await db.create("settings", { key: THEMES_KEY, value })
  }
}

async function getActiveThemeId(): Promise<string> {
  const stored = await db.findOne("settings", "key", ACTIVE_KEY)
  return stored?.value || defaultThemeId()
}

async function setActiveThemeId(id: string): Promise<void> {
  const existing = await db.findOne("settings", "key", ACTIVE_KEY)
  if (existing) {
    await db.update("settings", existing.id, { value: id })
  } else {
    await db.create("settings", { key: ACTIVE_KEY, value: id })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const customThemes = await getThemeLibrary()
    const allThemes = [...ALL_BUILTIN_THEMES, ...customThemes]
    const activeId = await getActiveThemeId()

    return NextResponse.json({
      success: true,
      data: {
        themes: allThemes,
        activeId,
      },
    })
  } catch (error) {
    console.error("Themes GET error:", error)
    return NextResponse.json({ success: false, error: "Gagal memuat tema" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    if (action === "create") {
      const { name, icon, config } = body
      if (!name) {
        return NextResponse.json({ success: false, error: "Nama tema wajib diisi" }, { status: 400 })
      }

      const customThemes = await getThemeLibrary()
      const newTheme: ThemeRecord = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        name,
        icon: icon || "🎨",
        isBuiltIn: false,
        isDefault: false,
        config: config || {},
      }
      customThemes.push(newTheme)
      await saveThemeLibrary(customThemes)
      await createAuditLog("CREATE", "theme", newTheme.id, `Membuat tema: ${name}`)

      return NextResponse.json({ success: true, data: newTheme, message: "Tema dibuat" })
    }

    if (action === "duplicate") {
      const { themeId, newName } = body
      if (!themeId || !newName) {
        return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
      }

      const customThemes = await getThemeLibrary()
      const allThemes = [...ALL_BUILTIN_THEMES, ...customThemes]
      const source = allThemes.find((t) => t.id === themeId)
      if (!source) {
        return NextResponse.json({ success: false, error: "Tema tidak ditemukan" }, { status: 404 })
      }

      const duplicated = cloneTheme(source, newName)
      customThemes.push(duplicated)
      await saveThemeLibrary(customThemes)
      await createAuditLog("DUPLICATE", "theme", duplicated.id, `Menggandakan tema: ${newName}`)

      return NextResponse.json({ success: true, data: duplicated, message: "Tema digandakan" })
    }

    if (action === "update") {
      const { themeId, name, icon, config } = body
      if (!themeId) {
        return NextResponse.json({ success: false, error: "ID tema diperlukan" }, { status: 400 })
      }

      const customThemes = await getThemeLibrary()
      const index = customThemes.findIndex((t) => t.id === themeId)
      if (index === -1) {
        return NextResponse.json({ success: false, error: "Tema tidak ditemukan atau tidak dapat diedit" }, { status: 404 })
      }

      if (name) customThemes[index].name = name
      if (icon) customThemes[index].icon = icon
      if (config) customThemes[index].config = { ...customThemes[index].config, ...config }
      await saveThemeLibrary(customThemes)
      await createAuditLog("UPDATE", "theme", themeId, `Mengupdate tema: ${customThemes[index].name}`)

      return NextResponse.json({ success: true, data: customThemes[index], message: "Tema diupdate" })
    }

    if (action === "delete") {
      const { themeId } = body
      if (!themeId) {
        return NextResponse.json({ success: false, error: "ID tema diperlukan" }, { status: 400 })
      }

      let customThemes = await getThemeLibrary()
      const target = customThemes.find((t) => t.id === themeId)
      if (!target) {
        return NextResponse.json({ success: false, error: "Tema tidak ditemukan atau tidak dapat dihapus" }, { status: 404 })
      }

      customThemes = customThemes.filter((t) => t.id !== themeId)
      await saveThemeLibrary(customThemes)
      await createAuditLog("DELETE", "theme", themeId, `Menghapus tema: ${target.name}`)

      // If deleted theme was active, reset to default
      const activeId = await getActiveThemeId()
      if (activeId === themeId) {
        await setActiveThemeId(defaultThemeId())
      }

      return NextResponse.json({ success: true, message: "Tema dihapus" })
    }

    if (action === "activate") {
      const { themeId } = body
      if (!themeId) {
        return NextResponse.json({ success: false, error: "ID tema diperlukan" }, { status: 400 })
      }

      const customThemes = await getThemeLibrary()
      const allThemes = [...ALL_BUILTIN_THEMES, ...customThemes]
      const target = allThemes.find((t) => t.id === themeId)
      if (!target) {
        return NextResponse.json({ success: false, error: "Tema tidak ditemukan" }, { status: 404 })
      }

      await setActiveThemeId(themeId)
      await createAuditLog("ACTIVATE", "theme", themeId, `Mengaktifkan tema: ${target.name}`)

      return NextResponse.json({ success: true, data: target.config, message: `Tema "${target.name}" aktif` })
    }

    if (action === "reset") {
      await setActiveThemeId(defaultThemeId())
      await createAuditLog("RESET", "theme", null, "Mereset ke tema default")
      return NextResponse.json({ success: true, message: "Tema direset ke default" })
    }

    if (action === "import") {
      const { themeJSON } = body
      if (!themeJSON) {
        return NextResponse.json({ success: false, error: "JSON tema diperlukan" }, { status: 400 })
      }

      let parsed
      try {
        parsed = typeof themeJSON === "string" ? JSON.parse(themeJSON) : themeJSON
      } catch {
        return NextResponse.json({ success: false, error: "Format JSON tidak valid" }, { status: 400 })
      }

      if (!parsed.name || !parsed.config) {
        return NextResponse.json({ success: false, error: "JSON harus memiliki name dan config" }, { status: 400 })
      }

      const customThemes = await getThemeLibrary()
      const newTheme: ThemeRecord = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        name: parsed.name,
        icon: parsed.icon || "🎨",
        isBuiltIn: false,
        isDefault: false,
        config: parsed.config,
      }
      customThemes.push(newTheme)
      await saveThemeLibrary(customThemes)
      await createAuditLog("IMPORT", "theme", newTheme.id, `Mengimpor tema: ${parsed.name}`)

      return NextResponse.json({ success: true, data: newTheme, message: "Tema diimpor" })
    }

    return NextResponse.json({ success: false, error: "Aksi tidak dikenal" }, { status: 400 })
  } catch (error) {
    console.error("Themes POST error:", error)
    return NextResponse.json({ success: false, error: "Gagal memproses tema" }, { status: 500 })
  }
}
