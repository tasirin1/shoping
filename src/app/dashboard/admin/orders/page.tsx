"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils"

export default function OrdersPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const loadData = async () => {
    try {
      const p = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (statusFilter) p.set("status", statusFilter)
      const r = await fetch(`/api/admin/orders?${p}`)
      const d = await r.json()
      if (d.success) { setData(d.data || []); setTotalPages(d.pagination?.totalPages || 1) }
    } catch {} finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, [page, statusFilter])

  const statuses = ["", "PENDING", "SUCCESS", "FAILED", "EXPIRED"]

  return (<div>
    <h1 className="text-xl font-bold mb-4">Pesanan</h1>
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
      {statuses.map((s) => (
        <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? "bg-primary-600 text-white" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100"}`}>{s ? getStatusLabel(s) : "Semua"}</button>
      ))}
    </div>
    <DataTable columns={[
      { key: "invoice", label: "Invoice", render: (v: string) => <span className="font-mono text-xs">{v}</span> },
      { key: "user", label: "User", render: (_: any, r: any) => r.user?.username || "-" },
      { key: "game", label: "Game", render: (_: any, r: any) => r.game?.name || "-" },
      { key: "total", label: "Total", render: (v: number) => <span className="font-semibold text-primary-600">{formatCurrency(v)}</span> },
      { key: "status", label: "Status", render: (v: string) => {
        const colors: Record<string, string> = { SUCCESS: "bg-green-50 text-green-700", PENDING: "bg-yellow-50 text-yellow-700", FAILED: "bg-red-50 text-red-700", EXPIRED: "bg-gray-100 text-gray-500" }
        return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[v] || "bg-gray-100 text-gray-500"}`}>{getStatusLabel(v)}</span>
      }},
      { key: "createdAt", label: "Tanggal", className: "hidden md:table-cell", render: (v: string) => <span className="text-xs text-gray-500">{formatDate(v)}</span> },
    ]} data={data} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} emptyMessage="Belum ada pesanan" />
  </div>)
}
