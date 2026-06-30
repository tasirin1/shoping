"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(""); const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", email: "", role: "USER", phone: "", suspended: false })
  const { toast } = useToast()
  const loadData = async () => {
    try {
      const p = new URLSearchParams()
      if (search) p.set("search", search)
      const r = await fetch(`/api/users?${p}`); const d = await r.json()
      if (d.success) setData(d.data || [])
    } catch {} finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, [loadData])

  const openEdit = (u: any) => { setEditing(u); setForm({ name: u.name || "", email: u.email, role: u.role, phone: u.phone || "", suspended: u.suspended }); setModal(true) }
  
  const save = async () => {
    if (!editing) return
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (d.success) { toast("success", "User diupdate"); setModal(false); loadData() }
      else toast("error", d.error || "Gagal")
    } catch { toast("error", "Gagal") }
  }

  return (<div>
    <h1 className="text-xl font-bold mb-4">User</h1>
    <DataTable columns={[
      { key: "username", label: "Username" },
      { key: "email", label: "Email", className: "hidden md:table-cell" },
      { key: "name", label: "Nama", className: "hidden sm:table-cell" },
      { key: "role", label: "Role", render: (v: string) => v === "ADMIN" ? <Badge variant="info">Admin</Badge> : <Badge>User</Badge> },
      { key: "suspended", label: "Status", render: (v: boolean) => v ? <Badge variant="danger">Suspend</Badge> : <Badge variant="success">Aktif</Badge> },
    ]} data={data} loading={loading} search={search} onSearchChange={setSearch} onEdit={openEdit} emptyMessage="Tidak ada user" />
    
    <Modal open={modal} onClose={() => setModal(false)} title="Edit User" size="lg">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        <Input label="Email" value={form.email} disabled />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm">
            <option value="USER">User</option><option value="ADMIN">Admin</option>
          </select>
        </div>
        <Input label="No. Telepon" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.suspended} onChange={(e) => setForm({...form, suspended: e.target.checked})} className="rounded border-gray-300" /> Suspended</label>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button>
          <Button type="submit" fullWidth>Simpan</Button>
        </div>
      </form>
    </Modal>
  </div>)
}
