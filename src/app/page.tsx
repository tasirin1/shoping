"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { HeroSection } from "@/components/home/HeroSection"
import { GameCard } from "@/components/game/GameCard"
import { PromoSection } from "@/components/home/PromoSection"
import { FAQSection } from "@/components/home/FAQSection"
import { GameGridSkeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { ArrowRight, TrendingUp, Gamepad2 } from "lucide-react"
import type { GameType } from "@/types"

export default function HomePage() {
  const [popularGames, setPopularGames] = useState<GameType[]>([])
  const [allGames, setAllGames] = useState<GameType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, allRes] = await Promise.all([
          fetch("/api/games?popular=true&limit=6"),
          fetch("/api/games?limit=8"),
        ])
        const [popularData, allData] = await Promise.all([
          popularRes.json(),
          allRes.json(),
        ])
        if (popularData.success) setPopularGames(popularData.data || [])
        if (allData.success) setAllGames(allData.data || [])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <HeroSection />

      {/* Game Populer */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                Game Populer
              </h2>
            </div>
            <Link href="/games">
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Semua
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <GameGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {popularGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>

      <PromoSection />

      {/* Semua Game */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                Semua Game
              </h2>
            </div>
            <Link href="/games">
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Semua
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <GameGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/games">
              <Button variant="outline" size="sm">
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
