"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { Plus, Edit2, Trash2, Ticket } from "lucide-react"
import type { PromoType } from "@/types"

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PromoType | null>(null)
  const [form, setForm] = useState({ code: "", name: "", description: "", discount: "", discountType: "PERCENTAGE", minPurchase: "", maxDiscount: "", maxUses: "" })

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/promos")
      const data = await res.json()
      if (data.success) setPromos(data.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm({ code: "", name: "", description: "", discount: "", discountType: "PERCENTAGE", minPurchase: "", maxDiscount: "", maxUses: "" }); setShowModal(true) }
  const openEdit = (p: PromoType) => { setEditing(p); setForm({ code: p.code, name: p.name, description: p.description || "", discount: p.discount.toString(), discountType: p.discountType, minPurchase: p.minPurchase?.toString() || "", maxDiscount: p.maxDiscount?.toString() || "", maxUses: p.maxUses?.toString() || "" }); setShowModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/admin/promos/${editing.id}` : "/api/admin/promos"
    const method = editing ? "PUT" : "POST"
    try {
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      setShowModal(false); fetchData()
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus promo?")) return
    try { await fetch(`/api/admin/promos/${id}`, { method: "DELETE" }); fetchData() } catch {}
  }

  if (loading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><TableSkeleton /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Promo</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Tambah Promo</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Kode</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Diskon</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Digunakan</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 font-mono font-medium text-primary-600">{p.code}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{p.name}</td>
                  <td className="py-3 px-4">{p.discountType === "PERCENTAGE" ? `${p.discount}%` : `Rp${p.discount.toLocaleString()}`}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{p.usedCount}/{p.maxUses || "∞"}</td>
                  <td className="py-3 px-4 text-center">{p.active ? <span className="text-green-600">Aktif</span> : <span className="text-red-600">Nonaktif</span>}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-gray-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {promos.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Belum ada promo</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Promo" : "Tambah Promo"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="code" label="Kode Promo" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} required />
              <Input id="name" label="Nama Promo" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <Input id="desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input id="discount" label="Diskon" type="number" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})} required />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
                  <select value={form.discountType} onChange={(e) => setForm({...form, discountType: e.target.value})} className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                    <option value="PERCENTAGE">Persentase</option>
                    <option value="NOMINAL">Nominal</option>
                  </select>
                </div>
              </div>
              <Input id="minPurchase" label="Min. Pembelian" type="number" value={form.minPurchase} onChange={(e) => setForm({...form, minPurchase: e.target.value})} />
              <Input id="maxDiscount" label="Maks. Diskon" type="number" value={form.maxDiscount} onChange={(e) => setForm({...form, maxDiscount: e.target.value})} />
              <Input id="maxUses" label="Maks. Penggunaan" type="number" value={form.maxUses} onChange={(e) => setForm({...form, maxUses: e.target.value})} />
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
