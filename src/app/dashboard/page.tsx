"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils"
import { User, Package, Timer, CheckCircle, ArrowRight, ShoppingBag } from "lucide-react"
import type { OrderType, UserType } from "@/types"

export default function UserDashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [uRes, oRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/orders?limit=5"),
        ])
        if (uRes.status === 401) { router.push("/login"); return }
        const uData = await uRes.json()
        if (uData.success) setUser(uData.data)
        if (oRes.ok) { const oData = await oRes.json(); if (oData.success) setOrders(oData.data || []) }
      } catch { /* */ } finally { setLoading(false) }
    }
    loadData()
  }, [router])

  if (loading) return (
    <div className="min-h-screen pt-20 pb-16 max-w-3xl mx-auto px-4">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-3 gap-3 mb-6">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      <Skeleton className="h-60 rounded-2xl" />
    </div>
  )

  if (!user) return null

  const stats = [
    { label: "Total", value: orders.length, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Pending", value: orders.filter(o => o.status === "PENDING").length, icon: Timer, color: "text-yellow-600 bg-yellow-50" },
    { label: "Berhasil", value: orders.filter(o => o.status === "SUCCESS").length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ]

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user.name || user.username}</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s) => (
            <Card key={s.label} padding="sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent orders */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pesanan Terbaru</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>
              Lihat <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          {orders.length > 0 ? (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{o.game?.name || "Game"}</p>
                      <p className="text-[10px] text-gray-400">{formatDate(o.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-primary-600">{formatCurrency(o.total)}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 mb-3">Belum ada transaksi</p>
              <Button size="sm" onClick={() => router.push("/games")}>Top Up Sekarang</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
