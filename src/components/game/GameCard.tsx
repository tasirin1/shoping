"use client"

import Link from "next/link"
import { GameType } from "@/types"
import { Card } from "@/components/ui/Card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Star } from "lucide-react"

interface GameCardProps {
  game: GameType
}

export function GameCard({ game }: GameCardProps) {
  const minPrice = game.nominals?.length
    ? Math.min(...game.nominals.map((n) => n.price))
    : 0

  return (
    <Link href={`/games/${game.slug}`}>
      <Card hover className="group h-full">
        <div className="relative">
          <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden mb-4">
            {game.icon ? (
              <img
                src={game.icon}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-300 dark:text-gray-700">
                  {game.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {game.popular && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500 text-white shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                Populer
              </span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {game.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
          {game.description || game.category || "Game populer"}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            {minPrice > 0 ? (
              <>
                <p className="text-xs text-gray-400">Mulai dari</p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {formatCurrency(minPrice)}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Lihat Detail</p>
            )}
          </div>
          <TrendingUp className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
        </div>
      </Card>
    </Link>
  )
}
