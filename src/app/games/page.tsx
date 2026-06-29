"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { GameCard } from "@/components/game/GameCard"
import { Skeleton } from "@/components/ui/Skeleton"
import { Search, Gamepad2 } from "lucide-react"
import type { GameType } from "@/types"

function GamesContent() {
  const searchParams = useSearchParams()
  const initial = searchParams.get("search") || ""

  const [games, setGames] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setSearch(initial)
  }, [initial])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const p = new URLSearchParams()
        if (search) p.set("search", search)
        p.set("limit", "50")
        const res = await fetch(`/api/games?${p}`)
        const d = await res.json()
        if (d.success) { setGames(d.data || []); setTotal(d.pagination?.total || 0) }
        else setError("Gagal memuat")
      } catch { setError("Gagal memuat game") } finally { setLoading(false) }
    }
    loadData()
  }, [search])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Game</h1>
            <p className="text-xs text-gray-500 mt-0.5">{total} game tersedia</p>
          </div>
          <div className="relative sm:ml-auto w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari game..." className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15" />
          </div>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-xs text-red-600 mb-4">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {games.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gamepad2 className="w-12 h-12 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <p className="text-sm text-gray-500">
              {search ? `Tidak ada "${search}"` : "Belum ada game"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GamesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 pb-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <GamesContent />
    </Suspense>
  )
}
