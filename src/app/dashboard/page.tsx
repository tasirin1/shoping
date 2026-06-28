"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils"
import { User, Package, Clock, TrendingUp, ArrowRight, Settings } from "lucide-react"
import type { OrderType, UserType } from "@/types"

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/orders?limit=5"),
        ])

        if (userRes.status === 401) {
          router.push("/login")
          return
        }

        const userData = await userRes.json()
        if (userData.success) setUser(userData.data)

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          if (ordersData.success) setOrders(ordersData.data || [])
        }
      } catch {
        setError("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const stats = [
    { label: "Total Pesanan", value: orders.length.toString(), icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Pending", value: orders.filter(o => o.status === "PENDING").length.toString(), icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
    { label: "Berhasil", value: orders.filter(o => o.status === "SUCCESS").length.toString(), icon: TrendingUp, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <User className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.name || user.username}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
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

        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pesanan Terbaru</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.game?.name || "Game"}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-500 mb-4">Belum ada pesanan</p>
              <Button onClick={() => router.push("/games")}>Mulai Top Up</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
