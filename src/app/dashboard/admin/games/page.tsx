"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { Package, Plus, Edit2, Trash2, Search } from "lucide-react"
import type { GameType } from "@/types"

interface GameWithCount extends GameType {
  _count?: { orders: number; nominals: number }
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<GameWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<GameWithCount | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "", category: "", popular: false, icon: "" })
  const [search, setSearch] = useState("")

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/admin/games")
      const data = await res.json()
      if (data.success) setGames(data.data || [])
    } catch {
      console.error("Failed to fetch")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: "", slug: "", description: "", category: "", popular: false, icon: "" })
    setShowModal(true)
  }

  const openEdit = (game: GameWithCount) => {
    setEditing(game)
    setForm({ name: game.name, slug: game.slug, description: game.description || "", category: game.category || "", popular: game.popular, icon: game.icon || "" })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/admin/games/${editing.id}` : "/api/admin/games"
    const method = editing ? "PUT" : "POST"
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (res.ok) {
        setShowModal(false)
        fetchGames()
      }
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus game ini?")) return
    try {
      await fetch(`/api/admin/games/${id}`, { method: "DELETE" })
      fetchGames()
    } catch {
      // ignore
    }
  }

  const filtered = games.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6"><Skeleton className="h-8 w-48 mb-6" /><TableSkeleton /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Game</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Tambah Game</Button>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari game..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Kategori</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Populer</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Pesanan</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((game) => (
                <tr key={game.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{game.name}</td>
                  <td className="py-3 px-4 text-gray-500">{game.slug}</td>
                  <td className="py-3 px-4 text-gray-500">{game.category || "-"}</td>
                  <td className="py-3 px-4 text-center">{game.popular ? "⭐" : "-"}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{game._count?.orders || 0}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(game)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(game.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Tidak ada game</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {editing ? "Edit Game" : "Tambah Game"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="name" label="Nama Game" value={form.name} onChange={(e) => setForm({...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} required />
              <Input id="slug" label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required />
              <Input id="category" label="Kategori" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
              </div>
              <Input id="icon" label="URL Icon" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({...form, popular: e.target.checked})} className="rounded border-gray-300" />
                <span className="text-gray-700 dark:text-gray-300">Game Populer</span>
              </label>
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
