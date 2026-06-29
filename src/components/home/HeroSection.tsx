"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Zap, Shield, Clock } from "lucide-react"

const features = [
  { icon: Zap, label: "Proses Cepat" },
  { icon: Shield, label: "Aman" },
  { icon: Clock, label: "24/7 Support" },
]

export function HeroSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/games?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className="relative min-h-[420px] md:min-h-[500px] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10 mb-4">
            Platform Top Up Terpercaya
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 animate-slideUp">
            Top Up Game
            <br />
            <span className="text-blue-300">Cepat &amp; Aman</span>
          </h1>

          <p className="text-sm md:text-base text-white/70 mb-6 max-w-md animate-fadeIn">
            Nikmati top up game favorit dengan harga terbaik dan proses instan.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-md animate-slideUp">
            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-150 focus-within:bg-white/15 focus-within:border-white/30">
              <Search className="ml-4 w-4 h-4 text-white/50 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari game..."
                className="w-full bg-transparent px-3.5 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <button type="submit" className="mr-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Cari
              </button>
            </div>
          </form>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mt-6 animate-fadeIn">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-white/60 text-xs">
                <f.icon className="w-3.5 h-3.5 text-blue-300" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
