"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor, cn } from "@/lib/utils"
import { ClipboardList, Timer, CheckCircle, XCircle, ChevronLeft, ChevronRight, Package } from "lucide-react"
import type { OrderType } from "@/types"

const filters = [
  { value: "", label: "Semua" },
  { value: "PENDING", label: "Pending", icon: Timer },
  { value: "SUCCESS", label: "Berhasil", icon: CheckCircle },
  { value: "FAILED", label: "Gagal", icon: XCircle },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const loadData = async () => {
      setLoading(true)
      try {
        const p = new URLSearchParams()
        if (filter) p.set("status", filter)
        p.set("page", page.toString())
        p.set("limit", "10")
        const res = await fetch(`/api/orders?${p}`)
        if (res.status === 401) { router.push("/login?redirect=/orders"); return }
        const d = await res.json()
        if (d.success) { setOrders(d.data || []); setTotalPages(d.pagination?.totalPages || 1) }
        else setError(d.error || "Gagal memuat")
      } catch { setError("Gagal memuat data") } finally { setLoading(false) }
    }
    loadData()
  }, [filter, page, router])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2.5">
          <ClipboardList className="w-5 h-5 text-primary-600" />
          Riwayat Pesanan
        </h1>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1) }}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150",
                filter === f.value
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              {f.icon && <f.icon className="w-3.5 h-3.5" />}
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs mb-4">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="space-y-3">
              {orders.map((o) => (
                <Card key={o.id} hover padding="sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{o.game?.name || "Game"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{o.nominal?.name} &middot; {o.playerId}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-primary-600">{formatCurrency(o.total)}</p>
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium ${getStatusColor(o.status)}`}>
                            {getStatusLabel(o.status)}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">{formatDate(o.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-500">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <ClipboardList className="w-12 h-12 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
            <p className="text-sm text-gray-500 mb-4">
              {filter ? "Tidak ada pesanan" : "Belum ada transaksi"}
            </p>
            {!filter && <Button onClick={() => router.push("/games")} size="sm">Top Up Sekarang</Button>}
          </div>
        )}
      </div>
    </div>
  )
}
