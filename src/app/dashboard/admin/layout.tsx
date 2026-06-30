"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Package, Gamepad2, Tags, ShoppingBag,
  Users, Image, Ticket, Wallet, Settings, 
  Menu, PanelLeftClose, Zap, FileText, Palette
} from "lucide-react"

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
      { href: "/dashboard/admin/themes", label: "Tema", icon: Palette },
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (!res.ok) { router.push("/login?redirect=/dashboard/admin"); return }
        const d = await res.json()
        if (!d.success || d.data.role !== "ADMIN") { router.push("/dashboard"); return }
      } catch { router.push("/login?redirect=/dashboard/admin") }
    }
    check()
  }, [router])

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                          active
                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                          collapsed && "justify-center px-2 relative"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4 shrink-0 transition-transform duration-150", "group-hover:scale-110")} />
                        {!collapsed && <span>{item.label}</span>}
                        {collapsed && (
                          <span className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-gray-900 dark:bg-gray-700 text-gray-100 text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 shadow-lg">
                            {item.label}
                          </span>
                        )}
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
          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-0">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Admin</span>
              {(() => {
                const path = pathname.replace("/dashboard/admin", "").replace(/\/$/, "")
                if (!path) return <><span className="text-gray-600">/</span><span className="text-gray-600 font-medium">Dashboard</span></>
                const parts = path.split("/").filter(Boolean)
                return parts.map((part, i) => (
                  <span key={part} className="flex items-center gap-1.5">
                    <span className="text-gray-600">/</span>
                    <span className={i === parts.length - 1 ? "text-gray-600 font-medium" : ""}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </span>
                  </span>
                ))
              })()}
            </nav>
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
