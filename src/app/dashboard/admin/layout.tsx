"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Package, TrendingUp, Ticket, Image,
  ShoppingBag, Users, Menu, X, ChevronLeft, LogOut, Shield
} from "lucide-react"

const adminMenu = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/games", label: "Game", icon: Package },
  { href: "/dashboard/admin/nominals", label: "Nominal", icon: TrendingUp },
  { href: "/dashboard/admin/promos", label: "Promo", icon: Ticket },
  { href: "/dashboard/admin/banners", label: "Banner", icon: Image },
  { href: "/dashboard/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/dashboard/admin/users", label: "User", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data.role === "ADMIN") {
          setIsAdmin(true)
          return
        }
      }
      router.push("/login")
    }
    check()
  }, [router])

  if (!isAdmin) return null

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      <div className="flex">
        {/* Sidebar */}
        <>
          {/* Overlay mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <aside className={cn(
            "fixed left-0 top-16 md:top-20 bottom-0 z-50 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}>
            <div className="p-4">
              <div className="flex items-center gap-2 px-3 py-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Admin Panel</span>
              </div>
              <nav className="space-y-1">
                {adminMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">Admin Panel</span>
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
