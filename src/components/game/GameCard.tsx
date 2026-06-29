"use client"

import Link from "next/link"
import { GameType } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Star } from "lucide-react"

interface GameCardProps {
  game: GameType
  index?: number
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  const minPrice = game.nominals?.length
    ? Math.min(...game.nominals.map((n) => n.price))
    : 0

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="card-base card-hover overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
          {game.icon ? (
            <img
              src={game.icon}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                {game.name.charAt(0)}
              </span>
            </div>
          )}
          {game.popular && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-600 text-white shadow-sm">
                <Star className="w-2.5 h-2.5 fill-current" />
                Populer
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
            {game.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {game.category || "Top Up Game"}
          </p>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
            {minPrice > 0 ? (
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Mulai</p>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(minPrice)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Lihat Harga</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
