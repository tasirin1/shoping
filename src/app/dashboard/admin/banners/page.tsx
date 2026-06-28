"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { Plus, Edit2, Trash2, Image } from "lucide-react"
import type { BannerType } from "@/types"

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BannerType | null>(null)
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", position: "0" })

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/banners")
      const data = await res.json()
      if (data.success) setBanners(data.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm({ title: "", subtitle: "", image: "", link: "", position: "0" }); setShowModal(true) }
  const openEdit = (b: BannerType) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || "", image: b.image || "", link: b.link || "", position: b.position.toString() }); setShowModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners"
    const method = editing ? "PUT" : "POST"
    try {
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      setShowModal(false); fetchData()
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner?")) return
    try { await fetch(`/api/admin/banners/${id}`, { method: "DELETE" }); fetchData() } catch {}
  }

  if (loading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><TableSkeleton /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banner</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Tambah Banner</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Posisi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Judul</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Subtitle</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Aktif</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-gray-500">{b.position}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{b.title}</td>
                  <td className="py-3 px-4 text-gray-500">{b.subtitle || "-"}</td>
                  <td className="py-3 px-4 text-center">{b.active ? "✅" : "❌"}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-gray-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada banner</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Banner" : "Tambah Banner"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="title" label="Judul" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              <Input id="subtitle" label="Subtitle" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} />
              <Input id="image" label="URL Gambar" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
              <Input id="link" label="Link" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} />
              <Input id="position" label="Posisi" type="number" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} fullWidth>Batal</Button>
                <Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
