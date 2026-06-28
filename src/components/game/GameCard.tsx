"use client"

import Link from "next/link"
import { GameType } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface GameCardProps {
  game: GameType
}

export function GameCard({ game }: GameCardProps) {
  const minPrice = game.nominals?.length
    ? Math.min(...game.nominals.map((n) => n.price))
    : 0

  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 transition-all duration-150 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 active:shadow-sm">
        {/* Image */}
        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden mb-3">
          {game.icon ? (
            <img
              src={game.icon}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-200 dark:text-gray-700">
                {game.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {game.name}
        </h3>

        {minPrice > 0 ? (
          <p className="text-xs text-gray-400 mt-0.5">
            Mulai {formatCurrency(minPrice)}
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">Lihat harga</p>
        )}
      </div>
    </Link>
  )
}
