"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Construction, ArrowLeft, Bell } from "lucide-react"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/20">
          <Construction className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Jual Akun
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
          Fitur jual akun sedang dalam pengembangan. Kami akan segera hadir dengan layanan terbaik untuk jual beli akun game.
        </p>

        <Card className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-100 dark:border-primary-900/30 mb-8">
          <div className="flex items-start gap-4">
            <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Coming Soon</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dapatkan notifikasi ketika fitur ini tersedia.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button onClick={() => router.push("/games")}>
            Top Up Game
          </Button>
        </div>
      </div>
    </div>
  )
}
