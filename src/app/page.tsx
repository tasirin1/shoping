"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HeroSection } from "@/components/home/HeroSection"
import { GameCard } from "@/components/game/GameCard"
import { PromoSection } from "@/components/home/PromoSection"
import { FAQSection } from "@/components/home/FAQSection"
import { HomeSkeleton } from "@/components/ui/Skeleton"
import { ChevronRight, TrendingUp, Grid3X3 } from "lucide-react"
import type { GameType } from "@/types"

export default function HomePage() {
  const [popular, setPopular] = useState<GameType[]>([])
  const [all, setAll] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          fetch("/api/games?popular=true&limit=6"),
          fetch("/api/games?limit=8"),
        ])
        const pData = await pRes.json()
        const aData = await aRes.json()
        if (pData.success) setPopular(pData.data || [])
        if (aData.success) setAll(aData.data || [])
      } catch {
        setError("Gagal memuat game. Periksa koneksi.")
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  if (loading) return <HomeSkeleton />

  return (
    <>
      <HeroSection />

      {/* Popular Games */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Game Populer</h2>
            </div>
            <Link href="/games" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              Lihat <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {popular.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <PromoSection />

      {/* All Games */}
      {all.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Semua Game</h2>
              </div>
              <Link href="/games" className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                Lihat <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {all.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection />

      {/* Footer spacing */}
      <div className="h-4" />
    </>
  )
}
