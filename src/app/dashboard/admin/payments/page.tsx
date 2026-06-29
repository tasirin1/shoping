"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"

export default function PaymentsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", type: "", accountNumber: "", accountName: "", active: true, sortOrder: "0" })
  const { toast } = useToast()
  const loadData = async () => { try { const r = await fetch("/api/admin/payments"); const d = await r.json(); if (d.success) setData(d.data || []) } catch {} finally { setLoading(false) } }
  useEffect(() => { loadData() }, [])
  const openAdd = () => { setEditing(null); setForm({ name: "", type: "", accountNumber: "", accountName: "", active: true, sortOrder: "0" }); setModal(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, type: p.type, accountNumber: p.accountNumber || "", accountName: p.accountName || "", active: p.active, sortOrder: p.sortOrder.toString() }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/payments/${editing.id}` : "/api/admin/payments"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (p: any) => { if (!confirm("Hapus?")) return; try { await fetch(`/api/admin/payments/${p.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div>
    <h1 className="text-xl font-bold mb-4">Pembayaran</h1>
    <DataTable columns={[{ key: "name", label: "Nama" }, { key: "type", label: "Tipe" }, { key: "active", label: "Status", render: (v: boolean) => v ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge> }]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Pembayaran" emptyMessage="Belum ada metode pembayaran" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Pembayaran" : "Tambah Pembayaran"}>
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <Input label="Tipe (QRIS, VIRTUAL_ACCOUNT, EWALLET)" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} required />
        <Input label="Nomor Rekening" value={form.accountNumber} onChange={(e) => setForm({...form, accountNumber: e.target.value})} />
        <Input label="Atas Nama" value={form.accountName} onChange={(e) => setForm({...form, accountName: e.target.value})} />
        <Input label="Urutan" type="number" value={form.sortOrder} onChange={(e) => setForm({...form, sortOrder: e.target.value})} />
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button><Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button></div>
      </form>
    </Modal>
  </div>)
}
