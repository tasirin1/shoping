"use client"

import Link from "next/link"
import { ShoppingBag, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Shoping
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Platform top up game terpercaya. Proses cepat, harga murah, dan banyak pilihan game.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Indonesia</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Menu
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/games", label: "Semua Game" },
                { href: "/coming-soon", label: "Jual Akun" },
                { href: "/orders", label: "Riwayat Pesanan" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Bantuan
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#faq", label: "FAQ" },
                { href: "#", label: "Kebijakan Privasi" },
                { href: "#", label: "Syarat & Ketentuan" },
                { href: "#", label: "Bantuan" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@shoping.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  support@shoping.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+6281234567890" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Shoping. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
