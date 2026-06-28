"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { GameCard } from "@/components/game/GameCard"
import { Skeleton } from "@/components/ui/Skeleton"
import { Input } from "@/components/ui/Input"
import { Search, Gamepad2, Filter } from "lucide-react"
import type { GameType } from "@/types"

function GamesContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [games, setGames] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("limit", "50")

        const res = await fetch(`/api/games?${params}`)
        const data = await res.json()

        if (data.success) {
          setGames(data.data || [])
          setTotal(data.pagination?.total || 0)
        } else {
          setError("Gagal memuat data")
        }
      } catch {
        setError("Gagal memuat data game")
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [search])

  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])

  const categories = [...new Set(games.filter(g => g.category).map(g => g.category!))]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Semua Game
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {total} game tersedia
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari game..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Gamepad2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Game tidak ditemukan
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search ? `Tidak ada game dengan nama "${search}"` : "Belum ada game tersedia"}
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
      <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4">
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
