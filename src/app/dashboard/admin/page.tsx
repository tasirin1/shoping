"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { DashboardSkeleton } from "@/components/ui/Skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import { LayoutDashboard, ShoppingBag, Users, TrendingUp, DollarSign, Package, Clock, AlertCircle } from "lucide-react"
import type { DashboardStats } from "@/types"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (res.status === 403 || res.status === 401) {
          router.push("/login")
          return
        }
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
        } else {
          setError(data.error || "Gagal memuat statistik")
        }
      } catch {
        setError("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [router])

  if (loading) return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <DashboardSkeleton />
    </div>
  )

  if (error) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  )

  const statCards = [
    { label: "Total Pesanan", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Pendapatan", value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Total User", value: stats?.totalUsers || 0, icon: Users, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
    { label: "Pending", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Admin</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pesanan Terbaru</h2>
          <div className="space-y-3">
            {stats?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.game?.name || "Game"} - {(order as any).user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-600">{formatCurrency(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada pesanan</p>
            )}
          </div>
        </Card>

        {/* Popular Games */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Game Populer</h2>
          <div className="space-y-3">
            {stats?.popularGames?.map((game, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{game.name}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-900 dark:text-gray-100">{game.count}x</p>
                  <p className="text-primary-600 font-medium">{formatCurrency(game.revenue)}</p>
                </div>
              </div>
            ))}
            {(!stats?.popularGames || stats.popularGames.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Menu Admin</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/admin/games", label: "Game", icon: Package },
            { href: "/dashboard/admin/nominals", label: "Nominal", icon: TrendingUp },
            { href: "/dashboard/admin/promos", label: "Promo", icon: DollarSign },
            { href: "/dashboard/admin/banners", label: "Banner", icon: LayoutDashboard },
            { href: "/dashboard/admin/orders", label: "Pesanan", icon: ShoppingBag },
            { href: "/dashboard/admin/users", label: "User", icon: Users },
          ].map((menu) => (
            <button
              key={menu.href}
              onClick={() => router.push(menu.href)}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-100 dark:hover:border-primary-900/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                <menu.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {menu.label}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
