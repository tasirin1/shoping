"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useThemeConfig } from "./ThemeInitializer"

export function Footer() {
  const { config: themeConfig } = useThemeConfig()

  return (
    <footer
      className="border-t border-gray-100 dark:border-gray-800"
      style={{
        backgroundColor: themeConfig.footerColor || "#1e293b",
        color: themeConfig.footerColor === "#ffffff" || themeConfig.footerColor === "#fff" ? "#111827" : "#e2e8f0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: themeConfig.buttonColor || "#2563eb" }}>
              {themeConfig.logo ? (
                <img src={themeConfig.logo} alt={themeConfig.siteName} className="w-4 h-4 object-contain" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <span
              className="text-sm font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${themeConfig.primaryColor || "#2563eb"}, ${themeConfig.secondaryColor || "#818cf8"})`,
              }}
            >
              {themeConfig.siteName || "Shoping"}
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-xs" style={{ color: themeConfig.footerColor === "#ffffff" ? "#6b7280" : "#94a3b8" }}>
            <Link href="/games" className="hover:text-primary-600 transition-colors">Game</Link>
            <Link href="/coming-soon" className="hover:text-primary-600 transition-colors">Jual Akun</Link>
            <Link href="/orders" className="hover:text-primary-600 transition-colors">Riwayat</Link>
            {themeConfig.socialInstagram && (
              <a href={themeConfig.socialInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Instagram</a>
            )}
          </nav>

          <p className="text-xs" style={{ color: themeConfig.footerColor === "#ffffff" ? "#9ca3af" : "#64748b" }}>
            {themeConfig.copyright || `© ${new Date().getFullYear()} Shoping.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
