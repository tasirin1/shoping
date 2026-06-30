"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { formatDate } from "@/lib/utils"

export default function LogsPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1)
  const loadData = async () => {
    try {
      const p = new URLSearchParams({ page: page.toString(), limit: "20" })
      const r = await fetch(`/api/admin/audit-logs?${p}`); const d = await r.json()
      if (d.success) { setData(d.data || []); setTotalPages(d.pagination?.totalPages || 1) }
    } catch {} finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, [loadData])

  return (<div>
    <h1 className="text-xl font-bold mb-4">Log Aktivitas</h1>
    <DataTable columns={[
      { key: "action", label: "Aksi", render: (v: string) => <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{v}</span> },
      { key: "entity", label: "Entitas" },
      { key: "entityId", label: "ID", className: "hidden md:table-cell" },
      { key: "user", label: "User", render: (_: any, r: any) => r.user?.username || "-" },
      { key: "createdAt", label: "Waktu", render: (v: string) => <span className="text-xs text-gray-500">{formatDate(v)}</span> },
    ]} data={data} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} emptyMessage="Belum ada log" />
  </div>)
}
