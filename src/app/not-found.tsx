import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Lihat Game
          </Link>
        </div>
      </div>
    </div>
  )
}
