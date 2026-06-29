"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Package, Gamepad2, Tags, ShoppingBag,
  Users, Image, Ticket, Wallet, Settings, Shield, LogOut,
  Menu, X, PanelLeftClose, ChevronDown, Zap, FileText
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const menuGroups = [
  {
    label: "Utama",
    items: [
      { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/dashboard/admin/games", label: "Produk", icon: Package },
      { href: "/dashboard/admin/categories", label: "Kategori", icon: Tags },
      { href: "/dashboard/admin/nominals", label: "Nominal", icon: Gamepad2 },
    ],
  },
  {
    label: "Penjualan",
    items: [
      { href: "/dashboard/admin/orders", label: "Pesanan", icon: ShoppingBag },
      { href: "/dashboard/admin/promos", label: "Promo", icon: Ticket },
      { href: "/dashboard/admin/payments", label: "Pembayaran", icon: Wallet },
    ],
  },
  {
    label: "Pengelolaan",
    items: [
      { href: "/dashboard/admin/banners", label: "Banner", icon: Image },
      { href: "/dashboard/admin/providers", label: "API Provider", icon: Zap },
      { href: "/dashboard/admin/users", label: "User", icon: Users },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { href: "/dashboard/admin/settings", label: "Website", icon: Settings },
      { href: "/dashboard/admin/logs", label: "Log Aktivitas", icon: FileText },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (!res.ok) { router.push("/login"); return }
        const d = await res.json()
        if (!d.success || d.data.role !== "ADMIN") { router.push("/login"); return }
      } catch { router.push("/login") }
    }
    check()
  }, [router])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (!mounted) return null

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950">
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 left-0 bottom-0 z-50 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-200 overflow-y-auto",
          collapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-3">
            <div className={cn("flex items-center justify-between mb-4", collapsed && "justify-center")}>
              {!collapsed && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</span>}
              <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <PanelLeftClose className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
              </button>
            </div>

            {menuGroups.map((group) => (
              <div key={group.label} className="mb-4">
                {!collapsed && <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase mb-1">{group.label}</p>}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                          collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className={cn("flex-1 transition-all duration-200", collapsed ? "lg:ml-16" : "lg:ml-64")}>
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Admin</span>
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
