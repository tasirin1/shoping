"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { ShoppingBag, Mail, User, Lock, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registrasi gagal")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daftar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Buat akun baru di Shoping</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Input id="email" label="Email" type="email" placeholder="nama@email.com" value={form.email} onChange={handleChange} icon={<Mail className="w-4 h-4" />} required />
            <Input id="username" label="Username" type="text" placeholder="username123" value={form.username} onChange={handleChange} icon={<User className="w-4 h-4" />} required />

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none w-4 h-4 text-gray-400" />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" value={form.password} onChange={handleChange} className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <Input id="confirmPassword" label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={handleChange} icon={<Lock className="w-4 h-4" />} required />

            <Button type="submit" fullWidth loading={loading}>Daftar</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Masuk</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
