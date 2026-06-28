"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ShoppingBag, ArrowLeft, Sparkles } from "lucide-react"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="max-w-md text-center">
        {/* Modern illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <ShoppingBag className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 sm:right-8 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-lg animate-scaleIn">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Fitur Jual Akun
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          🚀 Fitur ini sedang kami siapkan. Nantikan update berikutnya!
        </p>

        {/* Decorative cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { emoji: "🎮", label: "Game" },
            { emoji: "🔒", label: "Aman" },
            { emoji: "💰", label: "Terjangkau" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali
          </Button>
          <Button onClick={() => router.push("/games")} size="sm">
            Top Up Game
          </Button>
        </div>
      </div>
    </div>
  )
}
