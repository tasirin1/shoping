"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Zap, Shield, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

const heroImages = [
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImage, setCurrentImage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const features = [
    {
      icon: Zap,
      title: "Proses Cepat",
      description: "Top up dalam hitungan detik",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Pembayaran terenkripsi",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Bantuan kapan saja",
    },
  ]

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background images */}
      {heroImages.map((img, i) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === currentImage ? 1 : 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="animate-fadeIn">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-6">
              Platform Top Up Terpercaya
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slideUp">
            Top Up Game
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              Cepat & Aman
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fadeIn">
            Nikmati kemudahan top up game favoritmu dengan harga terbaik dan proses instan.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-xl mb-10 animate-slideUp">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white/20 focus-within:border-primary-400/50">
              <Search className="ml-4 w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game yang ingin kamu top up..."
                className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="mr-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Features */}
          <div className="flex flex-wrap gap-6 animate-slideUp">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  )
}
