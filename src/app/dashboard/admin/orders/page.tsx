"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor, cn } from "@/lib/utils"
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import type { OrderType } from "@/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      if (data.success) { setOrders(data.data || []); setTotalPages(data.pagination?.totalPages || 1) }
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, statusFilter])

  const statuses = ["", "PENDING", "SUCCESS", "FAILED", "EXPIRED"]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pesanan</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {statuses.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              statusFilter === s ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}>
            {s ? getStatusLabel(s) : "Semua"}
          </button>
        ))}
      </div>

      {loading ? <TableSkeleton /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Game</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{o.invoice}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{(o as any).user?.username || "-"}</td>
                    <td className="py-3 px-4">{(o as any).game?.name || "-"}</td>
                    <td className="py-3 px-4 text-right font-medium text-primary-600">{formatCurrency(o.total)}</td>
                    <td className="py-3 px-4 text-center"><Badge className={getStatusColor(o.status)}>{getStatusLabel(o.status)}</Badge></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Belum ada pesanan</td></tr>}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm text-gray-500">{page}/{totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
