"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import type { Product, Game } from "@/types"

interface FormState {
  gameId: string
  name: string
  amount: string
  price: string
  originalPrice: string
  costPrice: string
  stock: string
  active: boolean
}

const emptyForm: FormState = { gameId: "", name: "", amount: "", price: "", originalPrice: "", costPrice: "", stock: "-1", active: true }

export default function NominalsPage() {
  const [data, setData] = useState<Product[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      const [nRes, gRes] = await Promise.all([fetch("/api/admin/nominals"), fetch("/api/admin/games")])
      const n = await nRes.json(); const g = await gRes.json()
      if (n.success) setData(n.data)
      if (g.success) setGames(g.data)
    } catch { toast("error", "Gagal memuat data") } finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true) }
  const openEdit = (n: Product) => {
    setEditing(n)
    setForm({
      gameId: n.gameId, name: n.name,
      amount: n.amount.toString(), price: n.price.toString(),
      originalPrice: n.originalPrice?.toString() || "",
      costPrice: n.costPrice?.toString() || "",
      stock: n.stock?.toString() || "-1", active: n.active,
    })
    setModal(true)
  }

  const save = async () => {
    if (!form.gameId || !form.name) { toast("error", "Game dan nama wajib diisi"); return }
    const body = { ...form, amount: Number(form.amount), price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, costPrice: form.costPrice ? Number(form.costPrice) : null, stock: Number(form.stock) }
    try {
      const url = editing ? `/api/admin/nominals/${editing.id}` : "/api/admin/nominals"
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() }
      else toast("error", d.error || "Gagal")
    } catch { toast("error", "Gagal menyimpan") }
  }

  const remove = async (n: Product) => {
    if (!confirm("Hapus nominal ini?")) return
    try { await fetch(`/api/admin/nominals/${n.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() }
    catch { toast("error", "Gagal menghapus") }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Nominal</h1>
      <DataTable
        columns={[
          { key: "gameId", label: "Game", render: (_v: string, r: Product) => r.game?.name || "-" },
          { key: "name", label: "Nama", sortable: true },
          { key: "amount", label: "Jumlah", sortable: true, render: (v: number) => v.toLocaleString() },
          { key: "price", label: "Harga", sortable: true, render: (v: number) => `Rp${v.toLocaleString()}` },
          { key: "profit", label: "Untung", render: (_v: number, r: Product) => {
            const profit = (r.price || 0) - (r.costPrice || 0)
            return profit > 0 ? <span className="text-green-600 font-medium">Rp{profit.toLocaleString()}</span> : "-"
          }},
          { key: "stock", label: "Stok", render: (v: number) => v === -1 ? "∞" : v.toString() },
          { key: "active", label: "Status", render: (v: boolean) => v ? <span className="text-green-600">Aktif</span> : <span className="text-red-500">Nonaktif</span> },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={remove}
        addLabel="Tambah Nominal"
        emptyMessage="Belum ada nominal"
        searchPlaceholder="Cari nominal..."
      />

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Nominal" : "Tambah Nominal"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game</label>
            <select value={form.gameId} onChange={(e) => setForm({ ...form, gameId: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none">
              <option value="">Pilih Game</option>
              {games.map((g: Game) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <Input label="Nama Nominal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: 100 Diamonds" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Jumlah" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="100" />
            <Input label="Harga Jual" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="15000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Harga Modal" type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} placeholder="13000" />
            <Input label="Harga Asli" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="20000" />
          </div>
          <Input label="Stok (-1 = unlimited)" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Aktif</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModal(false)}>Batal</Button>
            <Button onClick={save}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
