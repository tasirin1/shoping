"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { HeroSection } from "@/components/home/HeroSection"
import { GameCard } from "@/components/game/GameCard"
import { PromoSection } from "@/components/home/PromoSection"
import { FAQSection } from "@/components/home/FAQSection"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Gamepad2, TrendingUp } from "lucide-react"
import type { GameType } from "@/types"

export default function HomePage() {
  const [popularGames, setPopularGames] = useState<GameType[]>([])
  const [allGames, setAllGames] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const gamesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [popularRes, allRes] = await Promise.all([
          fetch("/api/games?popular=true&limit=6"),
          fetch("/api/games?limit=8"),
        ])

        const popularData = await popularRes.json()
        const allData = await allRes.json()

        if (popularData.success) setPopularGames(popularData.data || [])
        if (allData.success) setAllGames(allData.data || [])
      } catch {
        setError("Gagal memuat data game")
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  return (
    <>
      <HeroSection />

      {/* Popular Games */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Game Populer
              </h2>
            </div>
            <Link href="/games">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : popularGames.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Belum ada game populer
            </p>
          )}
        </div>
      </section>

      <PromoSection />

      {/* All Games */}
      <section ref={gamesRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Semua Game
              </h2>
            </div>
            <Link href="/games">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/games">
              <Button variant="outline">
                Lihat Semua Game
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  )
}
