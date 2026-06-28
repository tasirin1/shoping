"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor, cn } from "@/lib/utils"
import { ClipboardList, ChevronLeft, ChevronRight, Package } from "lucide-react"
import type { OrderType } from "@/types"

const statusFilters = [
  { value: "", label: "Semua" },
  { value: "PENDING", label: "Pending" },
  { value: "SUCCESS", label: "Berhasil" },
  { value: "FAILED", label: "Gagal" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (statusFilter) params.set("status", statusFilter)
        params.set("page", page.toString())
        params.set("limit", "10")

        const res = await fetch(`/api/orders?${params}`)
        const data = await res.json()

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login")
            return
          }
          setError(data.error || "Gagal memuat pesanan")
          return
        }

        setOrders(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } catch {
        setError("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [statusFilter, page, router])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Riwayat Pesanan
          </h1>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                statusFilter === f.value
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {order.game?.name || "Game"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {order.nominal?.name} - {order.playerId}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            {formatCurrency(order.total)}
                          </span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{order.invoice}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {statusFilter ? "Tidak ada pesanan dengan status ini" : "Mulai top up game favoritmu"}
            </p>
            {!statusFilter && (
              <Button onClick={() => router.push("/games")}>Mulai Top Up</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
