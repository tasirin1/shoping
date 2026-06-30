"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency } from "@/lib/utils"

export default function PromosPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ code: "", name: "", description: "", discount: "", discountType: "PERCENTAGE", minPurchase: "", maxDiscount: "", maxUses: "", active: true })
  const { toast } = useToast()
  const loadData = async () => { try { const r = await fetch("/api/admin/promos"); const d = await r.json(); if (d.success) setData(d.data || []) } catch {} finally { setLoading(false) } }
  useEffect(() => { loadData() }, [loadData])
  const openAdd = () => { setEditing(null); setForm({ code: "", name: "", description: "", discount: "", discountType: "PERCENTAGE", minPurchase: "", maxDiscount: "", maxUses: "", active: true }); setModal(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ code: p.code, name: p.name, description: p.description || "", discount: p.discount.toString(), discountType: p.discountType, minPurchase: p.minPurchase?.toString() || "", maxDiscount: p.maxDiscount?.toString() || "", maxUses: p.maxUses?.toString() || "", active: p.active }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/promos/${editing.id}` : "/api/admin/promos"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (p: any) => { if (!confirm("Hapus promo?")) return; try { await fetch(`/api/admin/promos/${p.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div className="min-w-0">
    <h1 className="text-xl font-bold mb-4">Promo</h1>
    <DataTable columns={[{ key: "code", label: "Kode", render: (v: string) => <span className="font-mono text-primary-600">{v}</span> }, { key: "name", label: "Nama" }, { key: "discount", label: "Diskon", render: (_: any, r: any) => r.discountType === "PERCENTAGE" ? `${r.discount}%` : formatCurrency(r.discount) }, { key: "usedCount", label: "Terpakai", render: (_: any, r: any) => `${r.usedCount}/${r.maxUses || "∞"}` }, { key: "active", label: "Status", render: (v: boolean) => v ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge> }]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Promo" emptyMessage="Belum ada promo" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Promo" : "Tambah Promo"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Kode Promo" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} required />
        <Input label="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <Input label="Deskripsi" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Diskon" type="number" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})} required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
            <select value={form.discountType} onChange={(e) => setForm({...form, discountType: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none">
              <option value="PERCENTAGE">Persentase</option><option value="NOMINAL">Nominal</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Min Pembelian" type="number" value={form.minPurchase} onChange={(e) => setForm({...form, minPurchase: e.target.value})} />
          <Input label="Maks Diskon" type="number" value={form.maxDiscount} onChange={(e) => setForm({...form, maxDiscount: e.target.value})} />
          <Input label="Maks Pakai" type="number" value={form.maxUses} onChange={(e) => setForm({...form, maxUses: e.target.value})} />
        </div>
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button><Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button></div>
      </form>
    </Modal>
  </div>)
}
