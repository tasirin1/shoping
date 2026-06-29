"use client"
import { useEffect, useState } from "react"
import { DataTable, FormField } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { formatCurrency } from "@/lib/utils"

export default function NominalsPage() {
  const [data, setData] = useState<any[]>([]); const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ gameId: "", name: "", amount: "", price: "", originalPrice: "", costPrice: "", stock: "-1", active: true })
  const { toast } = useToast()
  const loadData = async () => {
    try { const [r1, r2] = await Promise.all([fetch("/api/admin/nominals"), fetch("/api/admin/games")]); const d1 = await r1.json(); const d2 = await r2.json(); if (d1.success) setData(d1.data || []); if (d2.success) setGames(d2.data || []) } catch {} finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, [])
  const openAdd = () => { setEditing(null); setForm({ gameId: "", name: "", amount: "", price: "", originalPrice: "", costPrice: "", stock: "-1", active: true }); setModal(true) }
  const openEdit = (n: any) => { setEditing(n); setForm({ gameId: n.gameId, name: n.name, amount: n.amount.toString(), price: n.price.toString(), originalPrice: n.originalPrice?.toString() || "", costPrice: n.costPrice?.toString() || "", stock: n.stock?.toString() || "-1", active: n.active }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/nominals/${editing.id}` : "/api/admin/nominals"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (n: any) => { if (!confirm("Hapus?")) return; try { await fetch(`/api/admin/nominals/${n.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div>
    <h1 className="text-xl font-bold mb-4">Nominal</h1>
    <DataTable columns={[
      { key: "name", label: "Nama" },
      { key: "gameId", label: "Game", render: (_: any, r: any) => r.game?.name || "-" },
      { key: "amount", label: "Jumlah", className: "hidden sm:table-cell" },
      { key: "price", label: "Harga", render: (v: number) => formatCurrency(v) },
      { key: "active", label: "Status", render: (v: boolean) => v ? <span className="text-green-600">Aktif</span> : <span className="text-red-600">Nonaktif</span> },
    ]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Nominal" emptyMessage="Belum ada nominal" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Nominal" : "Tambah Nominal"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <FormField label="Game" required><select value={form.gameId} onChange={(e) => setForm({...form, gameId: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15" required>
          <option value="">Pilih Game</option>
          {games.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select></FormField>
        <Input label="Nama Nominal" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Jumlah" type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
          <Input label="Harga Jual" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Harga Asli" type="number" value={form.originalPrice} onChange={(e) => setForm({...form, originalPrice: e.target.value})} />
          <Input label="Harga Modal" type="number" value={form.costPrice} onChange={(e) => setForm({...form, costPrice: e.target.value})} />
        </div>
        <Input label="Stok (-1 = tak terbatas)" type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button>
          <Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button>
        </div>
      </form>
    </Modal>
  </div>)
}
