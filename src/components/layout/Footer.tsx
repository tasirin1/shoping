"use client"

import Link from "next/link"
import { ShoppingBag, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Shoping
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {["Beranda", "Game", "Jual Akun", "Riwayat"].map((item) => (
              <Link
                key={item}
                href={item === "Beranda" ? "/" : item === "Game" ? "/games" : item === "Jual Akun" ? "/coming-soon" : "/orders"}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Mail className="w-3 h-3" />
            <a href="mailto:support@shoping.com" className="hover:text-gray-600 dark:hover:text-gray-300">support@shoping.com</a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Shoping.</p>
        </div>
      </div>
    </footer>
  )
}
