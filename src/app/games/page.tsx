"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { GameCard } from "@/components/game/GameCard"
import { Skeleton, GameCardSkeleton } from "@/components/ui/Skeleton"
import { Search, Gamepad2, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { GameType } from "@/types"

function GamesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initial = searchParams.get("search") || ""
  const categoryFilter = searchParams.get("category") || ""

  const [games, setGames] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [activeCategory, setActiveCategory] = useState(categoryFilter)

  useEffect(() => { setSearch(initial); setActiveCategory(categoryFilter) }, [initial, categoryFilter])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); setError(null)
      try {
        const p = new URLSearchParams()
        if (search) p.set("search", search)
        if (activeCategory) p.set("category", activeCategory)
        const [gamesRes, catRes] = await Promise.all([
          fetch(`/api/games?${p.toString()}`),
          fetch("/api/categories"),
        ])
        const g = await gamesRes.json(); const c = await catRes.json()
        if (g.success) { setGames(g.data); setTotal(g.total || g.data.length) }
        else setError(g.error)
        if (c.success) setCategories(c.data)
      } catch { setError("Gagal memuat data") } finally { setLoading(false) }
    }
    loadData()
  }, [search, activeCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (activeCategory) params.set("category", activeCategory)
    router.push(`/games?${params.toString()}`)
  }

  const clearFilters = () => { setSearch(""); setActiveCategory(""); router.push("/games") }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Search */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Semua Game</h1>
            <p className="text-primary-100 text-sm md:text-base mb-6">{total} game tersedia</p>
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari game..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 dark:bg-gray-900/95 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-1">
          <button
            onClick={clearFilters}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              !activeCategory ? "bg-primary-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.slug === activeCategory ? "" : cat.slug)
                const params = new URLSearchParams()
                if (search) params.set("search", search)
                if (cat.slug !== activeCategory) params.set("category", cat.slug)
                router.push(`/games?${params.toString()}`)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                activeCategory === cat.slug ? "bg-primary-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
          {(search || activeCategory) && (
            <button onClick={clearFilters} className="px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap flex items-center gap-1">
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-6">{error}</div>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 w-full min-w-0">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)
            : games.map((game, i) => <GameCard key={game.id} game={game} index={i} />)
          }
        </div>

        {!loading && games.length === 0 && (
          <div className="text-center py-20">
            <Gamepad2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Game tidak ditemukan</p>
            <button onClick={clearFilters} className="mt-3 text-primary-600 dark:text-primary-400 text-sm hover:underline">Reset filter</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GamesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full min-w-0">
            {Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    }>
      <GamesContent />
    </Suspense>
  )
}
