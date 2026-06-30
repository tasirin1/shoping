"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton } from "@/components/ui/Skeleton"
import { useToast } from "@/components/ui/Toast"
import { Save, Globe, Palette, Phone, Search } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
     
    const loadData = async () => {
      try {
        const r = await fetch("/api/admin/settings")
        const d = await r.json()
        if (d.success && d.data) setForm(d.data)
      } catch {} finally { setLoading(false) }
    }
    loadData()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (d.success) toast("success", "Pengaturan disimpan")
      else toast("error", d.error || "Gagal")
    } catch { toast("error", "Gagal menyimpan") } finally { setSaving(false) }
  }

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 rounded-2xl" /></div>

  const sections = [
    {
      title: "Umum", icon: Globe,
      fields: [
        { key: "site_name", label: "Nama Website", placeholder: "Shoping" },
        { key: "site_description", label: "Deskripsi Website", placeholder: "Platform top up game terpercaya", type: "textarea" },
        { key: "site_logo", label: "URL Logo" },
        { key: "site_favicon", label: "URL Favicon" },
      ],
    },
    {
      title: "Warna & Tampilan", icon: Palette,
      fields: [
        { key: "primary_color", label: "Warna Utama", placeholder: "#2563EB" },
        { key: "footer_text", label: "Teks Footer" },
      ],
    },
    {
      title: "Kontak", icon: Phone,
      fields: [
        { key: "contact_email", label: "Email", type: "email" },
        { key: "contact_whatsapp", label: "WhatsApp", placeholder: "62812xxxx" },
        { key: "contact_telegram", label: "Telegram", placeholder: "@username" },
        { key: "contact_discord", label: "Discord" },
      ],
    },
    {
      title: "SEO", icon: Search,
      fields: [
        { key: "meta_title", label: "Meta Title" },
        { key: "meta_description", label: "Meta Description", type: "textarea" },
      ],
    },
  ]

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Website</h1>
        <Button onClick={save} loading={saving}><Save className="w-4 h-4 mr-2" />Simpan</Button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} padding="md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <section.icon className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{section.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((f) => (
                f.type === "textarea" ? (
                  <div key={f.key} className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
                    <textarea value={form[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} rows={3} placeholder={f.placeholder} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
                  </div>
                ) : (
                  <Input key={f.key} id={f.key} label={f.label} value={form[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} placeholder={f.placeholder} type={f.type || "text"} />
                )
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
