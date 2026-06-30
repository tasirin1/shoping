"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ShoppingBag, User, Lock, Eye, EyeOff, Mail } from "lucide-react"

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const u = form.username.trim()
    if (u.length < 4) { setError("Username minimal 4 karakter"); return }
    if (u.length > 20) { setError("Username maksimal 20 karakter"); return }
    if (!/^[a-zA-Z0-9_]+$/.test(u)) { setError("Username hanya boleh huruf, angka, dan underscore"); return }
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return }
    if (form.password !== form.confirm) { setError("Konfirmasi password tidak cocok"); return }

    setLoading(true)
    try {
      const body: Record<string, string> = { username: u, password: form.password }
      if (form.email.trim()) body.email = form.email.trim()

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || "Registrasi gagal"); return }
      router.push("/dashboard")
      router.refresh()
    } catch { setError("Terjadi kesalahan") } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daftar</h1>
          <p className="text-sm text-gray-500 mt-1">Buat akun baru</p>
        </div>

        <Card padding="md">
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="4-20 karakter, huruf/angka/_"
                  value={form.username}
                  onChange={handle}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handle}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-10 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="confirm"
                  type={showPw ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={form.confirm}
                  onChange={handle}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handle}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>Daftar</Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-5">
            Sudah punya akun? <Link href="/login" className="text-primary-600 font-medium hover:underline">Masuk</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
