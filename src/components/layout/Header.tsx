"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "./ThemeProvider"
import { useThemeConfig } from "./ThemeInitializer"
import {
  ShoppingBag, Sun, Moon, Search, User, LogOut,
  LayoutDashboard, Shield, Menu, X, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/games", label: "Game" },
  { href: "/coming-soon", label: "Jual Akun" },
  { href: "/orders", label: "Riwayat" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string; email?: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { config: themeConfig } = useThemeConfig()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const d = await res.json()
          if (d.success) setUser(d.data)
        }
      } catch { /* ignore */ }
    }
    check()
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setShowSearch(false); setProfileOpen(false) }, [pathname])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setProfileOpen(false)
    router.push("/")
    router.refresh()
  }

  const userInitial = user?.username?.charAt(0).toUpperCase() || "U"

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
              {themeConfig.logo ? (
                <img src={themeConfig.logo} alt={themeConfig.siteName} className="w-5 h-5 object-contain" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              {themeConfig.siteName || "Shoping"}
            </span>
          </Link>

          {/* Desktop nav - center */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cari"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Ganti tema"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-150", profileOpen && "rotate-180")} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl py-1 animate-scaleIn z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.role === "ADMIN" ? "Administrator" : "Member"}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </Link>
                      <Link href="/orders" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        Riwayat Pesanan
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link href="/dashboard/admin" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="shadow-sm">Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar (collapsible) */}
      {showSearch && (
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game..."
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg animate-slideDown">
          <div className="px-4 py-4 space-y-1">
            {/* Auth buttons at TOP for mobile - always visible first */}
            {!user ? (
              <div className="flex items-center gap-2 pb-4 mb-3 border-b border-gray-100 dark:border-gray-800">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth size="md">Masuk</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button fullWidth size="md">Daftar</Button>
                </Link>
              </div>
            ) : (
              <div className="pb-4 mb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.role === "ADMIN" ? "Administrator" : "Member"}</p>
                  </div>
                </div>
                <div className="flex gap-2 px-3">
                  <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" fullWidth size="sm">
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />Dashboard
                    </Button>
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme toggle */}
            <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">Tema Gelap</span>
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors duration-200 relative",
                  resolvedTheme === "dark" ? "bg-primary-600" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center",
                  resolvedTheme === "dark" ? "translate-x-[18px]" : "translate-x-0.5"
                )}>
                  {resolvedTheme === "dark" ? <Moon className="w-3 h-3 text-primary-600" /> : <Sun className="w-3 h-3 text-amber-500" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
