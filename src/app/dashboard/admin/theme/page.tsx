"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton } from "@/components/ui/Skeleton"
import { useToast } from "@/components/ui/Toast"
import { useThemeConfig, applyThemeConfig } from "@/components/layout/ThemeInitializer"
import { DEFAULT_THEME, THEME_PRESETS, themeToCssVars } from "@/lib/theme"
import type { ThemeConfig, ThemePreset } from "@/types"
import {
  Save, RotateCcw, Undo2, Palette, Eye, Upload,
  Type, Image, Share2, FileImage, Brush, Check,
  ChevronDown, ChevronUp
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
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <div className="relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0 cursor-pointer"
            style={{ backgroundColor: value }}
            title={value}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-xs font-mono text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
            placeholder="#2563EB"
          />
        </div>
        {open && (
          <div className="absolute top-10 left-0 z-50 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
            <input
              type="color"
              value={value}
              onChange={(e) => { onChange(e.target.value); setOpen(true) }}
              className="w-48 h-32 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Section component
// ============================================================
function Section({ title, icon, defaultOpen = true, children }: {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 md:px-5 pb-5 space-y-4">{children}</div>}
    </Card>
  )
}

// ============================================================
// PresetCard
// ============================================================
function PresetCard({ preset, active, onApply }: {
  preset: ThemePreset
  active: boolean
  onApply: () => void
}) {
  const previewColors = {
    primary: preset.colors.primaryColor || DEFAULT_THEME.primaryColor,
    secondary: preset.colors.secondaryColor || DEFAULT_THEME.secondaryColor,
    accent: preset.colors.accentColor || DEFAULT_THEME.accentColor,
  }
  return (
    <button
      type="button"
      onClick={onApply}
      className={`relative p-4 rounded-xl border-2 transition-all duration-150 text-left cursor-pointer ${
        active
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
      }`}
    >
      {active && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex gap-1.5 mb-3">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: previewColors.primary }} />
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: previewColors.secondary }} />
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: previewColors.accent }} />
      </div>
      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{preset.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{preset.label}</p>
    </button>
  )
}

// ============================================================
// UploadButton
// ============================================================
function UploadButton({ currentUrl, folder, onUpload }: {
  currentUrl: string
  folder: string
  onUpload: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("folder", folder)
      const res = await fetch("/api/admin/upload", { method: "POST", body: form })
      const d = await res.json()
      if (d.success) {
        onUpload(d.data.url)
        toast("success", "File berhasil diunggah")
      } else {
        toast("error", d.error || "Gagal unggah")
      }
    } catch {
      toast("error", "Gagal mengunggah file")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {currentUrl && (
        <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="" className="w-full h-full object-contain" />
        </div>
      )}
      <label className="relative cursor-pointer">
        <Button type="button" variant="outline" size="sm" loading={uploading}>
          <Upload className="w-3.5 h-3.5 mr-1.5" />
          Upload
        </Button>
        <input type="file" accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </label>
      {currentUrl && (
        <button
          type="button"
          onClick={() => onUpload("")}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Hapus
        </button>
      )}
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function ThemePage() {
  const { config, loading: configLoading, refresh } = useThemeConfig()
  const [form, setForm] = useState<ThemeConfig>(DEFAULT_THEME)
  const [original, setOriginal] = useState<ThemeConfig>(DEFAULT_THEME)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [presets, setPresets] = useState<ThemePreset[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const { toast } = useToast()

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [themeRes, presetsRes] = await Promise.all([
          fetch("/api/admin/theme"),
          fetch("/api/admin/theme/presets"),
        ])
        const themeData = await themeRes.json()
        const presetsData = await presetsRes.json()
        if (themeData.success && themeData.data) {
          setForm(themeData.data)
          setOriginal(JSON.parse(JSON.stringify(themeData.data)))
        }
        if (presetsData.success) setPresets(presetsData.data)
      } catch {
        toast("error", "Gagal memuat data tema")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((key: keyof ThemeConfig, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (previewMode) applyThemeConfig(next)
      return next
    })
  }, [previewMode])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (d.success) {
        setOriginal(JSON.parse(JSON.stringify(form)))
        applyThemeConfig(form)
        toast("success", "Tema disimpan")
        refresh()
      } else {
        toast("error", d.error || "Gagal menyimpan")
      }
    } catch {
      toast("error", "Gagal menyimpan tema")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    try {
      const res = await fetch("/api/admin/theme", { method: "DELETE" })
      const d = await res.json()
      if (d.success) {
        setForm(DEFAULT_THEME)
        setOriginal(DEFAULT_THEME)
        applyThemeConfig(DEFAULT_THEME)
        toast("success", "Tema direset ke default")
        refresh()
      } else {
        toast("error", d.error || "Gagal reset")
      }
    } catch {
      toast("error", "Gagal mereset tema")
    }
  }

  const handleUndo = () => {
    const copy = JSON.parse(JSON.stringify(original))
    setForm(copy)
    applyThemeConfig(copy)
    toast("info", "Perubahan dibatalkan")
  }

  const applyPreset = async (slug: string) => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/theme/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: slug }),
      })
      const d = await res.json()
      if (d.success && d.data) {
        setForm(d.data)
        setOriginal(JSON.parse(JSON.stringify(d.data)))
        applyThemeConfig(d.data)
        toast("success", d.message || "Preset diterapkan")
        refresh()
      } else {
        toast("error", d.error || "Gagal menerapkan preset")
      }
    } catch {
      toast("error", "Gagal menerapkan preset")
    } finally {
      setSaving(false)
    }
  }

  const togglePreview = () => {
    const next = !previewMode
    setPreviewMode(next)
    if (next) {
      applyThemeConfig(form)
      toast("info", "Mode preview aktif. Perubahan terlihat langsung.")
    } else {
      applyThemeConfig(original)
    }
  }

  if (loading || configLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Theme Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Sesuaikan tampilan website secara realtime</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={previewMode ? "primary" : "outline"} size="sm" onClick={togglePreview}>
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {previewMode ? "Preview Aktif" : "Preview"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleUndo} title="Undo">
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset ke Default">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Simpan
          </Button>
        </div>
      </div>

      {/* Presets */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme Preset</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {THEME_PRESETS.map((p) => (
            <PresetCard
              key={p.slug}
              preset={p}
              active={form.preset === p.slug}
              onApply={() => applyPreset(p.slug)}
            />
          ))}
        </div>
      </section>

      {/* Settings */}
      <div className="space-y-4">
        {/* Brand */}
        <Section title="Brand" icon={<Image className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Input label="Nama Website" value={form.siteName} onChange={(e) => update("siteName", e.target.value)} placeholder="Shoping" />
              <Input label="Tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Top up game cepat & aman" />
              <Input label="Teks Footer" value={form.footerText} onChange={(e) => update("footerText", e.target.value)} placeholder="Shoping. All rights reserved." />
              <Input label="Copyright" value={form.copyright} onChange={(e) => update("copyright", e.target.value)} placeholder="© 2026 Shoping" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Logo</label>
                <UploadButton currentUrl={form.logo} folder="logo" onUpload={(url) => update("logo", url)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Logo (Dark Mode)</label>
                <UploadButton currentUrl={form.logoDark} folder="logo" onUpload={(url) => update("logoDark", url)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Favicon</label>
                <UploadButton currentUrl={form.favicon} folder="favicon" onUpload={(url) => update("favicon", url)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Icon Website</label>
                <UploadButton currentUrl={form.websiteIcon} folder="icon" onUpload={(url) => update("websiteIcon", url)} />
              </div>
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section title="Warna" icon={<Palette className="w-4 h-4" />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <ColorPicker label="Primary" value={form.primaryColor} onChange={(v) => update("primaryColor", v)} />
            <ColorPicker label="Secondary" value={form.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
            <ColorPicker label="Accent" value={form.accentColor} onChange={(v) => update("accentColor", v)} />
            <ColorPicker label="Tombol" value={form.buttonColor} onChange={(v) => update("buttonColor", v)} />
            <ColorPicker label="Navbar" value={form.navbarColor} onChange={(v) => update("navbarColor", v)} />
            <ColorPicker label="Footer" value={form.footerColor} onChange={(v) => update("footerColor", v)} />
            <ColorPicker label="Background" value={form.backgroundColor} onChange={(v) => update("backgroundColor", v)} />
            <ColorPicker label="Card" value={form.cardColor} onChange={(v) => update("cardColor", v)} />
            <ColorPicker label="Teks" value={form.textColor} onChange={(v) => update("textColor", v)} />
            <ColorPicker label="Link" value={form.linkColor} onChange={(v) => update("linkColor", v)} />
            <ColorPicker label="Success" value={form.successColor} onChange={(v) => update("successColor", v)} />
            <ColorPicker label="Warning" value={form.warningColor} onChange={(v) => update("warningColor", v)} />
            <ColorPicker label="Error" value={form.errorColor} onChange={(v) => update("errorColor", v)} />
          </div>
        </Section>

        {/* Style */}
        <Section title="Style" icon={<Brush className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Border Radius" value={form.borderRadius} onChange={(e) => update("borderRadius", e.target.value)} placeholder="1rem" helperText="Contoh: 0.5rem, 12px, 16px" />
            <Input label="Shadow" value={form.shadow} onChange={(e) => update("shadow", e.target.value)} placeholder="0 1px 3px rgba(0,0,0,0.08)" />
          </div>
        </Section>

        {/* Font */}
        <Section title="Font" icon={<Type className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Font Utama" value={form.fontFamily} onChange={(e) => update("fontFamily", e.target.value)} placeholder="Inter, system-ui, sans-serif" />
            <Input label="Font Heading" value={form.headingFont} onChange={(e) => update("headingFont", e.target.value)} placeholder="Inter, system-ui, sans-serif" />
          </div>
        </Section>

        {/* Images */}
        <Section title="Gambar" icon={<FileImage className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Hero Image</label>
              <UploadButton currentUrl={form.heroImage} folder="hero" onUpload={(url) => update("heroImage", url)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Banner Homepage</label>
              <UploadButton currentUrl={form.bannerHome} folder="banner" onUpload={(url) => update("bannerHome", url)} />
            </div>
          </div>
        </Section>

        {/* Social Media */}
        <Section title="Media Sosial" icon={<Share2 className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Facebook URL" value={form.socialFacebook} onChange={(e) => update("socialFacebook", e.target.value)} placeholder="https://facebook.com/shoping" />
            <Input label="Twitter / X URL" value={form.socialTwitter} onChange={(e) => update("socialTwitter", e.target.value)} placeholder="https://twitter.com/shoping" />
            <Input label="Instagram URL" value={form.socialInstagram} onChange={(e) => update("socialInstagram", e.target.value)} placeholder="https://instagram.com/shoping" />
            <Input label="Youtube URL" value={form.socialYoutube} onChange={(e) => update("socialYoutube", e.target.value)} placeholder="https://youtube.com/@shoping" />
          </div>
        </Section>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {previewMode ? "Mode preview — perubahan terlihat langsung" : "Klik Preview untuk melihat perubahan"}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleUndo}>
            <Undo2 className="w-3.5 h-3.5 mr-1.5" />
            Undo
          </Button>
          <Button variant="danger" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Simpan
          </Button>
        </div>
      </div>
    </div>
  )
}
