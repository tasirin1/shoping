"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"

const features = [
  { icon: Zap, label: "Proses Cepat", desc: "Hitungan detik" },
  { icon: Shield, label: "100% Aman", desc: "Terpercaya" },
  { icon: Clock, label: "24/7 Support", desc: "Bantuan" },
]

export function HeroSection() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/games?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden">
      {/* Simplified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-950 dark:to-primary-950/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-4 border border-primary-200/50 dark:border-primary-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Top Up Game Terpercaya
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
            Top Up Game
            <br />
            <span className="text-primary-600 dark:text-primary-400">Cepat & Aman</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Isi ulang game favorit kamu dalam hitungan detik. Harga terbaik, proses instan.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary-400">
              <Search className="ml-4 w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari game..."
                className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Features */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {features.map((f) => (
              <div key={f.label} className="text-center">
                <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-1.5">
                  <f.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{f.label}</p>
                <p className="text-[10px] text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
