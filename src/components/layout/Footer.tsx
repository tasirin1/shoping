"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Shoping</span>
          </Link>

          <nav className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/games" className="hover:text-primary-600 transition-colors">Game</Link>
            <Link href="/coming-soon" className="hover:text-primary-600 transition-colors">Jual Akun</Link>
            <Link href="/orders" className="hover:text-primary-600 transition-colors">Riwayat</Link>
          </nav>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Shoping.
          </p>
        </div>
      </div>
    </footer>
  )
}
