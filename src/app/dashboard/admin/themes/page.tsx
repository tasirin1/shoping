"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton } from "@/components/ui/Skeleton"
import { useToast } from "@/components/ui/Toast"
import { useThemeConfig } from "@/components/layout/ThemeInitializer"
import { DARK_DEFAULT, applyThemeVars, exportThemeJSON } from "@/lib/theme"
import type { ThemeConfig, ThemeRecord } from "@/types"
import {
  Save, Plus, Trash2, Copy, Download, Upload, RotateCcw,
  Palette, Check, X, Search, Eye, FileJson, Star
} from "lucide-react"

// ============================================================
// ColorPicker Component
// ============================================================
function ColorPicker({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <div className="relative">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-lg border border-gray-700 shrink-0 cursor-pointer"
            style={{ backgroundColor: value }}
            title={value} />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-gray-700 bg-gray-900 px-2 text-xs font-mono text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none" />
        </div>
        {open && <div className="absolute top-9 left-0 z-50 p-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            className="w-40 h-28 rounded-lg cursor-pointer" />
        </div>}
      </div>
    </div>
  )
}

// ============================================================
// Theme Card
// ============================================================
function ThemeCard({ theme, active, onActivate, onDuplicate, onDelete, onEdit }: {
  theme: ThemeRecord
  active: boolean
  onActivate: () => void
  onDuplicate: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  const c = theme.config
  return (
    <div className={`relative rounded-xl border-2 transition-all duration-150 overflow-hidden ${
      active
        ? "border-primary-500 bg-gray-900 shadow-lg shadow-primary-500/10"
        : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
    }`}>
      {/* Mini preview bar */}
      <div className="h-2 flex">
        <div className="flex-1" style={{ backgroundColor: c.primaryColor }} />
        <div className="flex-1" style={{ backgroundColor: c.secondaryColor }} />
        <div className="flex-1" style={{ backgroundColor: c.accentColor }} />
        <div className="flex-1" style={{ backgroundColor: c.backgroundColor }} />
        <div className="flex-1" style={{ backgroundColor: c.cardColor }} />
        <div className="flex-1" style={{ backgroundColor: c.navbarColor }} />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-100 flex items-center gap-1.5">
                {theme.name}
                {theme.isDefault && <Star className="w-3 h-3 text-yellow-500" />}
                {active && <span className="text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">Aktif</span>}
              </p>
              <p className="text-xs text-gray-500">{theme.isBuiltIn ? "Bawaan" : "Kustom"}</p>
            </div>
          </div>
        </div>

        {/* Mini color dots */}
        <div className="flex flex-wrap gap-1 mb-3">
          {[c.primaryColor, c.secondaryColor, c.accentColor, c.textColor, c.textSecondary, c.successColor, c.warningColor, c.errorColor].map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-gray-700" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button size="sm" variant={active ? "primary" : "outline"} onClick={onActivate} className="flex-1">
            {active ? "Aktif" : "Aktifkan"}
          </Button>
          {!theme.isBuiltIn && (
            <Button size="sm" variant="ghost" onClick={onEdit}><Palette className="w-3.5 h-3.5" /></Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDuplicate}><Copy className="w-3.5 h-3.5" /></Button>
          {!theme.isBuiltIn && (
            <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Theme Editor Modal
// ============================================================
function ThemeEditor({ theme, onSave, onClose }: {
  theme: ThemeRecord
  onSave: (config: ThemeConfig) => void
  onClose: () => void
}) {
  const [config, setConfig] = useState<ThemeConfig>({ ...theme.config })
  const [preview, setPreview] = useState(false)
  const { toast } = useToast()

  const update = (key: keyof ThemeConfig, value: string) => {
    const next = { ...config, [key]: value }
    setConfig(next)
    if (preview) applyThemeVars(next)
  }

  const handleSave = () => {
    onSave(config)
    toast("success", "Tema diupdate")
  }

  const sections = [
    {
      title: "Warna Utama",
      keys: ["primaryColor", "secondaryColor", "accentColor", "surfaceColor"] as (keyof ThemeConfig)[],
      labels: ["Primary", "Secondary", "Accent", "Surface"],
    },
    {
      title: "Layout",
      keys: ["navbarColor", "sidebarColor", "footerColor", "backgroundColor"] as (keyof ThemeConfig)[],
      labels: ["Navbar", "Sidebar", "Footer", "Background"],
    },
    {
      title: "Komponen",
      keys: ["buttonColor", "inputColor", "borderColor", "cardColor"] as (keyof ThemeConfig)[],
      labels: ["Button", "Input", "Border", "Card"],
    },
    {
      title: "Teks",
      keys: ["textColor", "textSecondary", "linkColor"] as (keyof ThemeConfig)[],
      labels: ["Text", "Text Secondary", "Link"],
    },
    {
      title: "Status",
      keys: ["successColor", "warningColor", "errorColor", "infoColor"] as (keyof ThemeConfig)[],
      labels: ["Success", "Warning", "Error", "Info"],
    },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-16 pb-8 px-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">{theme.icon}</span>
            <h2 className="font-semibold text-gray-100">Edit: {theme.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={preview ? "primary" : "outline"} size="sm" onClick={() => {
              setPreview(!preview)
              if (!preview) applyThemeVars(config)
              else {
                // Will be restored on close
              }
              toast("info", preview ? "Preview nonaktif" : "Preview aktif")
            }}>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">{section.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {section.keys.map((key, i) => (
                  <ColorPicker key={key} label={section.labels[i]} value={config[key] || ""} onChange={(v) => update(key, v)} />
                ))}
              </div>
            </div>
          ))}

          {/* Typography */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Typography & Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Input label="Font Family" value={config.fontFamily} onChange={(e) => update("fontFamily", e.target.value)} />
              <Input label="Heading Font" value={config.headingFont} onChange={(e) => update("headingFont", e.target.value)} />
              <Input label="Font Size" value={config.fontSize} onChange={(e) => update("fontSize", e.target.value)} placeholder="16px" />
              <Input label="Border Radius" value={config.borderRadius} onChange={(e) => update("borderRadius", e.target.value)} placeholder="0.75rem" />
              <Input label="Shadow" value={config.shadow} onChange={(e) => update("shadow", e.target.value)} />
              <Input label="Spacing" value={config.spacing} onChange={(e) => update("spacing", e.target.value)} placeholder="1rem" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            {preview ? "🟢 Preview aktif — perubahan terlihat langsung" : "Klik Preview untuk melihat perubahan"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Batal</Button>
            <Button size="sm" onClick={handleSave}><Save className="w-3.5 h-3.5 mr-1.5" />Simpan</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function ThemesPage() {
  const { loading: configLoading, activeThemeId, setActiveTheme, refresh } = useThemeConfig()
  const [themes, setThemes] = useState<ThemeRecord[]>([])
  const [activeId, setActiveId] = useState(activeThemeId)
  const [loading, setLoading] = useState(true)
  const [editingTheme, setEditingTheme] = useState<ThemeRecord | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [newName, setNewName] = useState("")
  const [newIcon, setNewIcon] = useState("🎨")
  const [importJSON, setImportJSON] = useState("")
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const loadThemes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/themes")
      const d = await res.json()
      if (d.success && d.data) {
        setThemes(d.data.themes)
        setActiveId(d.data.activeId)
      }
    } catch {
      toast("error", "Gagal memuat tema")
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadThemes() }, [loadThemes])

  const activate = async (id: string) => {
    await setActiveTheme(id)
    setActiveId(id)
    toast("success", "Tema diterapkan")
  }

  const duplicate = async (themeId: string) => {
    const name = prompt("Nama tema baru:")
    if (!name) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", themeId, newName: name }),
      })
      const d = await res.json()
      if (d.success) {
        toast("success", "Tema digandakan")
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal menggandakan") } finally { setSaving(false) }
  }

  const deleteTheme = async (themeId: string) => {
    const name = themes.find((t) => t.id === themeId)?.name
    if (!confirm(`Hapus tema "${name}"?`)) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", themeId }),
      })
      const d = await res.json()
      if (d.success) {
        toast("success", "Tema dihapus")
        if (activeId === themeId) {
          setActiveId("builtin_dark")
          await setActiveTheme("builtin_dark")
        }
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal menghapus") } finally { setSaving(false) }
  }

  const saveEditedTheme = async (config: ThemeConfig) => {
    if (!editingTheme) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", themeId: editingTheme.id, config }),
      })
      const d = await res.json()
      if (d.success) {
        toast("success", "Tema diupdate")
        if (activeId === editingTheme.id) {
          applyThemeVars(config)
        }
        setEditingTheme(null)
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal menyimpan") } finally { setSaving(false) }
  }

  const createTheme = async () => {
    if (!newName.trim()) { toast("error", "Nama tema wajib diisi"); return }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", name: newName.trim(), icon: newIcon, config: DARK_DEFAULT }),
      })
      const d = await res.json()
      if (d.success) {
        toast("success", "Tema dibuat")
        setShowCreate(false)
        setNewName("")
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal membuat tema") } finally { setSaving(false) }
  }

  const importTheme = async () => {
    if (!importJSON.trim()) { toast("error", "JSON tema diperlukan"); return }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", themeJSON: importJSON.trim() }),
      })
      const d = await res.json()
      if (d.success) {
        toast("success", "Tema diimpor")
        setShowImport(false)
        setImportJSON("")
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal mengimpor") } finally { setSaving(false) }
  }

  const exportTheme = (theme: ThemeRecord) => {
    const json = exportThemeJSON(theme)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `theme_${theme.name.toLowerCase().replace(/\s+/g, "_")}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast("success", "Tema diekspor")
  }

  const handleReset = async () => {
    if (!confirm("Reset ke tema Dark default?")) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      })
      const d = await res.json()
      if (d.success) {
        await setActiveTheme("builtin_dark")
        setActiveId("builtin_dark")
        toast("success", "Tema direset ke default")
        loadThemes()
      } else toast("error", d.error)
    } catch { toast("error", "Gagal reset") } finally { setSaving(false) }
  }

  if (loading || configLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Theme Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola tema website ({themes.length} tema)</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)} loading={saving}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />Import
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} loading={saving}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />Reset
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />Tema Baru
          </Button>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            active={activeId === theme.id}
            onActivate={() => activate(theme.id)}
            onDuplicate={() => duplicate(theme.id)}
            onDelete={() => deleteTheme(theme.id)}
            onEdit={() => setEditingTheme(theme)}
          />
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 animate-scaleIn space-y-4">
            <h2 className="font-semibold text-gray-100">Tema Baru</h2>
            <Input label="Nama Tema" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="My Theme" />
            <Input label="Icon (emoji)" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="🎨" />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Batal</Button>
              <Button size="sm" onClick={createTheme} loading={saving}>Buat</Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl p-6 animate-scaleIn space-y-4">
            <h2 className="font-semibold text-gray-100">Import Tema (JSON)</h2>
            <p className="text-xs text-gray-500">Tempel JSON tema yang diekspor dari dashboard ini atau tema lain yang kompatibel.</p>
            <textarea
              value={importJSON}
              onChange={(e) => setImportJSON(e.target.value)}
              placeholder='{"name": "My Theme", "icon": "🎨", "config": { ... }}'
              className="w-full h-32 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-xs font-mono text-gray-100 resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowImport(false)}>Batal</Button>
              <Button size="sm" onClick={importTheme} loading={saving}>
                <Upload className="w-3.5 h-3.5 mr-1.5" />Import
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Editor Modal */}
      {editingTheme && (
        <ThemeEditor
          theme={editingTheme}
          onSave={saveEditedTheme}
          onClose={() => setEditingTheme(null)}
        />
      )}

      {/* Bottom info */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Tema aktif: <strong className="text-gray-300">{themes.find((t) => t.id === activeId)?.name || "Dark"}</strong></span>
          <span className="mx-2">·</span>
          <span>{themes.filter((t) => t.isBuiltIn).length} bawaan, {themes.filter((t) => !t.isBuiltIn).length} kustom</span>
          <span className="mx-2">·</span>
          <button onClick={() => {
            const active = themes.find((t) => t.id === activeId)
            if (active) exportTheme(active)
          }} className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
            <Download className="w-3 h-3" />Ekspor tema aktif
          </button>
        </div>
      </div>
    </div>
  )
}
