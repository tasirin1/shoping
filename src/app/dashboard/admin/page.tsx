"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils"
import {
  ShoppingBag, Users, DollarSign, Clock,
  TrendingUp, TrendingDown, Activity, Wallet
} from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  pendingOrders: number
  successOrders: number
  recentOrders: any[]
  popularGames: { name: string; count: number; revenue: number }[]
  revenueToday: number
  revenueYesterday: number
  ordersToday: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        if (res.ok) { const d = await res.json(); if (d.success) setStats(d.data) }
      } catch {} finally { setLoading(false) }
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )

  const cards = [
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats?.totalRevenue || 0),
      sub: `${formatCurrency(stats?.revenueToday || 0)} hari ini`,
      icon: DollarSign,
      trend: "up",
      color: "from-green-500 to-emerald-600",
      bg: "bg-gradient-to-br",
    },
    {
      label: "Total Pesanan",
      value: stats?.totalOrders || 0,
      sub: `${stats?.ordersToday || 0} hari ini`,
      icon: ShoppingBag,
      trend: "up",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-gradient-to-br",
    },
    {
      label: "Total User",
      value: stats?.totalUsers || 0,
      sub: `${stats?.successOrders || 0} transaksi sukses`,
      icon: Users,
      trend: "up",
      color: "from-purple-500 to-pink-600",
      bg: "bg-gradient-to-br",
    },
    {
      label: "Menunggu",
      value: stats?.pendingOrders || 0,
      sub: "perlu diproses",
      icon: Clock,
      trend: stats && stats.pendingOrders > 0 ? "down" : "up",
      color: stats && stats.pendingOrders > 0 ? "from-amber-500 to-orange-600" : "from-emerald-500 to-teal-600",
      bg: "bg-gradient-to-br",
    },
  ]

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Overview bisnis {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-3.5 h-3.5" />
          <span>Terakhir diperbarui: {new Date().toLocaleTimeString("id-ID")}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} ${c.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
                <c.icon className="w-5 h-5" />
              </div>
              {c.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-white/70" />
              ) : (
                <TrendingDown className="w-4 h-4 text-white/70" />
              )}
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-white/80 mt-0.5">{c.label}</p>
            <p className="text-[10px] text-white/60 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2" padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pesanan Terbaru</h2>
            {stats && stats.recentOrders && (
              <span className="text-xs text-gray-400">{stats.recentOrders.length} pesanan</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">Invoice</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">Game</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">User</th>
                  <th className="text-right py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">Total</th>
                  <th className="text-center py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">Status</th>
                  <th className="text-right py-2.5 px-2 font-medium text-gray-500 text-xs uppercase">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.slice(0, 8).map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-gray-900 dark:text-gray-100">{order.invoice}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{order.game?.name || "-"}</td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{order.user?.username || "-"}</td>
                    <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={
                        order.status === "SUCCESS" ? "success" :
                        order.status === "PENDING" ? "warning" :
                        order.status === "FAILED" ? "danger" : "default"
                      }>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">Belum ada pesanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Popular Games */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Game Terpopuler</h2>
            <Wallet className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.popularGames?.slice(0, 8).map((game: any, i: number) => (
              <div key={game.name || i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{game.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{game.count} pesanan</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(game.revenue || 0)}</p>
              </div>
            ))}
            {(!stats?.popularGames || stats.popularGames.length === 0) && (
              <div className="py-10 text-center text-gray-400 text-sm">Belum ada data</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
