"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton"
import { formatDate } from "@/lib/utils"
import { Users, Search, Shield, User, ChevronLeft, ChevronRight } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
      if (search) params.set("search", search)
      const res = await fetch(`/api/users?${params}`)
      const data = await res.json()
      if (data.success) { setUsers(data.data || []); setTotalPages(data.pagination?.totalPages || 1) }
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, search])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User</h1>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Cari user..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </Card>

      {loading ? <TableSkeleton /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Nama</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Pesanan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{u.username}</td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4 text-gray-500">{u.name || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      {u.role === "ADMIN" ? <Shield className="w-4 h-4 text-primary-600 mx-auto" /> : <User className="w-4 h-4 text-gray-400 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">{u._count?.orders || 0}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Tidak ada user</td></tr>}
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
