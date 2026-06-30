"use client"

import { useEffect, useState } from "react"
import { DataTable, FormField } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"

interface Game {
  id: string; name: string; slug: string; categoryName: string | null
  popular: boolean; active: boolean; icon: string | null; description: string | null
  _count?: { orders: number; nominals: number }
}

export default function AdminGamesPage() {
  const [data, setData] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Game | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "", categoryName: "", icon: "", popular: false, active: true })
  const { toast } = useToast()

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/games")
      const d = await res.json()
      if (d.success) setData(d.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [loadData])

  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", description: "", categoryName: "", icon: "", popular: false, active: true }); setModal(true) }
  const openEdit = (g: Game) => { setEditing(g); setForm({ name: g.name, slug: g.slug, description: g.description || "", categoryName: g.categoryName || "", icon: g.icon || "", popular: g.popular, active: g.active }); setModal(true) }

  const save = async () => {
    const url = editing ? `/api/admin/games/${editing.id}` : "/api/admin/games"
    const method = editing ? "PUT" : "POST"
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const d = await res.json()
      if (d.success) { toast("success", editing ? "Game diupdate" : "Game ditambahkan"); setModal(false); loadData() }
      else toast("error", d.error || "Gagal")
    } catch { toast("error", "Gagal menyimpan") }
  }

  const remove = async (g: Game) => {
    if (!confirm(`Hapus ${g.name}?`)) return
    try {
      const res = await fetch(`/api/admin/games/${g.id}`, { method: "DELETE" })
      const d = await res.json()
      if (d.success) { toast("success", "Game dihapus"); loadData() }
      else toast("error", d.error || "Gagal")
    } catch { toast("error", "Gagal menghapus") }
  }

  const filtered = data.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.slug.includes(search))

  const columns = [
    { key: "name", label: "Nama", render: (v: string, r: Game) => <div className="min-w-0"><p className="font-medium text-gray-900 dark:text-gray-100">{v}</p><p className="text-xs text-gray-400">{r.slug}</p></div> },
    { key: "category", label: "Kategori", className: "hidden md:table-cell" },
    { key: "popular", label: "Populer", className: "hidden sm:table-cell", render: (v: boolean) => v ? <Badge variant="success">Ya</Badge> : "-" },
    { key: "active", label: "Status", render: (v: boolean) => v ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge> },
    { key: "_count", label: "Pesanan", className: "hidden md:table-cell", render: (_: any, r: Game) => r._count?.orders || 0 },
  ]

  return (
    <div className="min-w-0">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Produk / Game</h1>
      <DataTable columns={columns} data={filtered} loading={loading} search={search} onSearchChange={setSearch}
        onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Game" emptyMessage="Belum ada game" />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Game" : "Tambah Game"} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="name" label="Nama Game" value={form.name} onChange={(e) => setForm({...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} required />
            <Input id="slug" label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required />
          </div>
          <Input id="categoryName" label="Kategori" value={form.categoryName} onChange={(e) => setForm({...form, categoryName: e.target.value})} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
          </div>
          <Input id="icon" label="URL Icon" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({...form, popular: e.target.checked})} className="rounded border-gray-300" /> Populer</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} className="rounded border-gray-300" /> Aktif</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button>
            <Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
