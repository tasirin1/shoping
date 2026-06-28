"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit2, Trash2 } from "lucide-react"
import type { NominalType } from "@/types"

interface NominalWithGame extends NominalType {
  game?: { name: string; slug: string }
}

export default function AdminNominalsPage() {
  const [nominals, setNominals] = useState<NominalWithGame[]>([])
  const [games, setGames] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<NominalWithGame | null>(null)
  const [form, setForm] = useState({ gameId: "", name: "", amount: "", price: "", originalPrice: "" })

  const fetchData = async () => {
    try {
      const [nomRes, gameRes] = await Promise.all([
        fetch("/api/admin/nominals"),
        fetch("/api/admin/games"),
      ])
      const nomData = await nomRes.json()
      const gameData = await gameRes.json()
      if (nomData.success) setNominals(nomData.data || [])
      if (gameData.success) setGames(gameData.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ gameId: "", name: "", amount: "", price: "", originalPrice: "" })
    setShowModal(true)
  }

  const openEdit = (nom: NominalWithGame) => {
    setEditing(nom)
    setForm({ gameId: nom.gameId, name: nom.name, amount: nom.amount.toString(), price: nom.price.toString(), originalPrice: nom.originalPrice?.toString() || "" })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/admin/nominals/${editing.id}` : "/api/admin/nominals"
    const method = editing ? "PUT" : "POST"
    try {
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      setShowModal(false)
      fetchData()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus nominal?")) return
    try {
      await fetch(`/api/admin/nominals/${id}`, { method: "DELETE" })
      fetchData()
    } catch {
      // ignore
    }
  }

  if (loading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><TableSkeleton /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nominal</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Tambah Nominal</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Game</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Harga</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {nominals.map((nom) => (
                <tr key={nom.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{nom.game?.name || "-"}</td>
                  <td className="py-3 px-4 font-medium">{nom.name}</td>
                  <td className="py-3 px-4 text-gray-500">{nom.amount}</td>
                  <td className="py-3 px-4 text-right font-medium text-primary-600">
                    {formatCurrency(nom.price)}
                    {nom.originalPrice && <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(nom.originalPrice)}</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(nom)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(nom.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {nominals.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada nominal</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Nominal" : "Tambah Nominal"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Game</label>
                <select value={form.gameId} onChange={(e) => setForm({...form, gameId: e.target.value})} className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" required>
                  <option value="">Pilih Game</option>
                  {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <Input id="name" label="Nama Nominal" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <Input id="amount" label="Amount (in-game currency)" type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
              <Input id="price" label="Harga (Rp)" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
              <Input id="originalPrice" label="Harga Asli (Rp, opsional)" type="number" value={form.originalPrice} onChange={(e) => setForm({...form, originalPrice: e.target.value})} />
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
