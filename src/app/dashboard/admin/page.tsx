"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  ShoppingBag, Users,  DollarSign,
  Clock
} from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
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
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  )

  const cards = [
    { label: "Total Pesanan", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20" },
    { label: "Pendapatan", value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: "bg-green-50 text-green-600 dark:bg-green-900/20" },
    { label: "User", value: stats?.totalUsers || 0, icon: Users, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20" },
    { label: "Pending", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20" },
  ]

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <Card key={c.label} padding="md">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card padding="md">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Pesanan Terbaru</h2>
          <div className="space-y-2">
            {stats?.recentOrders?.slice(0, 5).map((o: any) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{o.game?.name || "-"}</p>
                  <p className="text-[10px] text-gray-400">{o.user?.username} · {formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold text-primary-600">{formatCurrency(o.total)}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    o.status === "SUCCESS" ? "bg-green-50 text-green-600" :
                    o.status === "PENDING" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada pesanan</p>
            )}
          </div>
        </Card>

        {/* Popular Games */}
        <Card padding="md">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Produk Terlaris</h2>
          <div className="space-y-2">
            {stats?.popularGames?.map((g: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{g.name}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{g.count}x</p>
                  <p className="text-primary-600">{formatCurrency(g.revenue)}</p>
                </div>
              </div>
            ))}
            {(!stats?.popularGames || stats.popularGames.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-6">Belum ada data</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
