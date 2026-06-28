"use client"

import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Maaf, terjadi kesalahan. Silakan coba lagi.
        </p>
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </div>
  )
}
