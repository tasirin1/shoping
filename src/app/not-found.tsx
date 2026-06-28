import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Cari Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
