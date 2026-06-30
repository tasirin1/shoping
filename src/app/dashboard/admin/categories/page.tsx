"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"

export default function CategoriesPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", slug: "", icon: "", active: true, sortOrder: "0" })
  const { toast } = useToast()
  const loadData = async () => { try { const r = await fetch("/api/admin/categories"); const d = await r.json(); if (d.success) setData(d.data || []) } catch {} finally { setLoading(false) } }
  useEffect(() => { loadData() }, [loadData])
  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", icon: "", active: true, sortOrder: "0" }); setModal(true) }
  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name, slug: c.slug, icon: c.icon || "", active: c.active, sortOrder: c.sortOrder.toString() }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({...form, sortOrder: parseInt(form.sortOrder) || 0 }) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (c: any) => { if (!confirm("Hapus?")) return; try { await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div>
    <h1 className="text-xl font-bold mb-4">Kategori</h1>
    <DataTable columns={[{ key: "name", label: "Nama" }, { key: "slug", label: "Slug", className: "hidden sm:table-cell" }, { key: "sortOrder", label: "Urutan", className: "hidden sm:table-cell" }, { key: "_count", label: "Game", render: (_: any, r: any) => r._count?.games || 0 }]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} emptyMessage="Belum ada kategori" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Kategori" : "Tambah Kategori"}>
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} required />
        <Input label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required />
        <Input label="Icon URL" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} />
        <Input label="Urutan" type="number" value={form.sortOrder} onChange={(e) => setForm({...form, sortOrder: e.target.value})} />
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button><Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button></div>
      </form>
    </Modal>
  </div>)
}
