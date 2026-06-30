"use client"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import { Badge } from "@/components/ui/Badge"

export default function ProvidersPage() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", baseUrl: "", apiKey: "", apiSecret: "", merchantId: "", active: true, sandbox: true })
  const { toast } = useToast()
  const loadData = async () => { try { const r = await fetch("/api/admin/providers"); const d = await r.json(); if (d.success) setData(d.data || []) } catch {} finally { setLoading(false) } }
  useEffect(() => { loadData() }, [loadData])
  const openAdd = () => { setEditing(null); setForm({ name: "", baseUrl: "", apiKey: "", apiSecret: "", merchantId: "", active: true, sandbox: true }); setModal(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, baseUrl: p.baseUrl || "", apiKey: p.apiKey || "", apiSecret: p.apiSecret || "", merchantId: p.merchantId || "", active: p.active, sandbox: p.sandbox }); setModal(true) }
  const save = async () => {
    const url = editing ? `/api/admin/providers/${editing.id}` : "/api/admin/providers"
    try { const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await res.json(); if (d.success) { toast("success", editing ? "Diupdate" : "Ditambahkan"); setModal(false); loadData() } else toast("error", d.error) } catch { toast("error", "Gagal") }
  }
  const remove = async (p: any) => { if (!confirm("Hapus provider?")) return; try { await fetch(`/api/admin/providers/${p.id}`, { method: "DELETE" }); toast("success", "Dihapus"); loadData() } catch {} }

  return (<div className="min-w-0">
    <h1 className="text-xl font-bold mb-4">API Provider</h1>
    <DataTable columns={[{ key: "name", label: "Nama" }, { key: "baseUrl", label: "Base URL", className: "hidden md:table-cell" }, { key: "sandbox", label: "Mode", render: (v: boolean) => v ? <Badge variant="warning">Sandbox</Badge> : <Badge variant="success">Production</Badge> }, { key: "active", label: "Status", render: (v: boolean) => v ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge> }]} data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={remove} addLabel="Tambah Provider" emptyMessage="Belum ada provider" />
    <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Provider" : "Tambah Provider"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="space-y-4">
        <Input label="Nama Provider" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
        <Input label="Base URL" value={form.baseUrl} onChange={(e) => setForm({...form, baseUrl: e.target.value})} placeholder="https://api.provider.com" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="API Key" value={form.apiKey} onChange={(e) => setForm({...form, apiKey: e.target.value})} />
          <Input label="API Secret" value={form.apiSecret} onChange={(e) => setForm({...form, apiSecret: e.target.value})} />
        </div>
        <Input label="Merchant ID" value={form.merchantId} onChange={(e) => setForm({...form, merchantId: e.target.value})} />
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.sandbox} onChange={(e) => setForm({...form, sandbox: e.target.checked})} className="rounded border-gray-300" /> Sandbox Mode</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} className="rounded border-gray-300" /> Aktif</label>
        </div>
        <div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModal(false)} fullWidth>Batal</Button><Button type="submit" fullWidth>{editing ? "Simpan" : "Tambah"}</Button></div>
      </form>
    </Modal>
  </div>)
}
