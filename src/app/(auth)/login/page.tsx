"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ShoppingBag, User, Lock, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!username.trim()) { setError("Username wajib diisi"); return }
    if (!password) { setError("Password wajib diisi"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error || "Login gagal"); return }
      const target = redirectTo || (d.data?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard")
      router.push(target)
      router.refresh()
    } catch { setError("Terjadi kesalahan. Coba lagi.") } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Masuk</h1>
          <p className="text-sm text-gray-500 mt-1">Selamat datang kembali</p>
        </div>

        <Card padding="md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-10 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>Masuk</Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-5">
            Belum punya akun? <Link href="/register" className="text-primary-600 font-medium hover:underline">Daftar</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
        <div className="skeleton-pulse h-96 w-full max-w-sm rounded-2xl" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
