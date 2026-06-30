"use client"

import { Button } from "@/components/ui/Button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" role="alert">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Gagal Memuat Halaman
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">
        {error.message || "Terjadi kesalahan saat memuat halaman admin."}
      </p>
      <Button onClick={reset} variant="primary" size="md">
        <RefreshCw className="w-4 h-4 mr-1.5" />
        Muat Ulang
      </Button>
    </div>
  )
}
