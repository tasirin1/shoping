"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"

export default function BannersPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", position: "0", active: true })
  const { toast } = useToast()
  const loadData = async () => { try { const r = await fetch("/api/admin/banners"); const d = await r.json(); if (d.success) setData(d.data || []) } catch {} finally { setLoading(false) } }
  useEffect(() => { loadData() }, [loadData])
  const openAdd = () => { setEditing(null); setForm({ title: "", subtitle: "", image: "", link: "", position: "0", active: true }); setModal(true) }
  const openEdit = (b: any) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || "", image: b.image || "", link: b.link || "", position: b.position.toString(), active: b.active }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({...form, position: parseInt(form.position) || 0 }) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (b: any) => { if (!confirm("Hapus banner?")) return; try { await fetch(`/api/admin/banners/${b.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div>
    <h1 className="text-xl font-bold mb-4">Banner</h1>
    <DataTable columns={[{ key: "position", label: "Urutan" }, { key: "title", label: "Judul" }, { key: "subtitle", label: "Subtitle", className: "hidden sm:table-cell" }, { key: "active", label: "Status", render: (v: boolean) => v ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge> }]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Banner" emptyMessage="Belum ada banner" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Banner" : "Tambah Banner"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Judul" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
        <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} />
        <Input label="URL Gambar" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." />
        {form.image && <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-32"><img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLElement).style.display = "none"} /></div>}
        <Input label="Link" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} />
        <Input label="Urutan" type="number" value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} />
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button><Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button></div>
      </form>
    </Modal>
  </div>)
}
