"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ShoppingBag, ArrowRight, Bell } from "lucide-react"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-blue-50 dark:from-primary-900/30 dark:via-primary-900/20 dark:to-blue-900/20 flex items-center justify-center shadow-sm">
            <div className="relative">
              <ShoppingBag className="w-14 h-14 text-primary-600 dark:text-primary-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                ✨
              </div>
            </div>
          </div>
          {/* Decorative dots */}
          <div className="absolute top-2 left-1/2 -translate-x-20 w-2 h-2 rounded-full bg-primary-200 dark:bg-primary-800" />
          <div className="absolute bottom-4 right-1/4 w-1.5 h-1.5 rounded-full bg-blue-200 dark:bg-blue-800" />
          <div className="absolute top-8 right-1/3 w-1 h-1 rounded-full bg-primary-300 dark:bg-primary-700" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30 mb-4">
          🚀 Coming Soon
        </span>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Fitur Jual Akun
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Sedang kami siapkan dengan penuh semangat. Nantikan update berikutnya untuk mulai jual beli akun game dengan aman dan mudah!
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
          {[
            { icon: "🛡️", label: "Transaksi Aman" },
            { icon: "⚡", label: "Proses Cepat" },
            { icon: "🤝", label: "Terpercaya" },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{f.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/games")}
          >
            Top Up Game
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Notify */}
        <div className="mt-6 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30">
          <div className="flex items-center justify-center gap-2 text-sm text-primary-700 dark:text-primary-400">
            <Bell className="w-4 h-4" />
            <span>Pantau terus website kami untuk info terbaru!</span>
          </div>
        </div>
      </div>
    </div>
  )
}
