"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatCurrency, getStatusLabel, getStatusColor } from "@/lib/utils"
import {
  CheckCircle, Clock, AlertCircle, ArrowLeft,
  Copy, Loader2, ShoppingBag, BadgeCheck
} from "lucide-react"
import type { OrderType } from "@/types"

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get("orderId")

  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)
  const [payData, setPayData] = useState<any>(null)
  const [payLoading, setPayLoading] = useState(false)
  const [countdown, setCountdown] = useState(24 * 3600)
  const [status, setStatus] = useState("PENDING")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) { setLoading(false); return }
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/orders?limit=1")
        const d = await res.json()
        if (d.success) {
          const found = d.data.find((o: OrderType) => o.id === orderId)
          if (found) { setOrder(found); setStatus(found.status) }
        }
      } catch { /* */ } finally { setLoading(false) }
    }
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (!order || status !== "PENDING") return
    const init = async () => {
      setPayLoading(true)
      try {
        const res = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })
        const d = await res.json()
        if (d.success) {
          setPayData(d.data)
          const expires = new Date(d.data.expiresAt).getTime()
          setCountdown(Math.max(0, Math.floor((expires - Date.now()) / 1000)))
        }
      } catch { /* */ } finally { setPayLoading(false) }
    }
    init()
  }, [order, status])

  useEffect(() => {
    if (countdown <= 0 || status !== "PENDING") return
    const timer = setInterval(() => setCountdown((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(timer)
  }, [countdown, status])

  // Mock auto-success
  useEffect(() => {
    if (status !== "PENDING" || !order) return
    const timer = setTimeout(async () => {
      try {
        await fetch("/api/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoice: order.invoice, status: "SUCCESS" }),
        })
        setStatus("SUCCESS")
      } catch { /* */ }
    }, 15000) // 15 detik
    return () => clearTimeout(timer)
  }, [order, status])

  const fmtCountdown = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 max-w-lg mx-auto px-4">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Pesanan tidak ditemukan</h2>
          <p className="text-sm text-gray-500 mb-4">Buat pesanan terlebih dahulu</p>
          <Button onClick={() => router.push("/games")}>Cari Game</Button>
        </div>
      </div>
    )
  }

  // Success state
  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5 animate-scaleIn">
            <BadgeCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pembayaran Berhasil!</h2>
          <p className="text-sm text-gray-500 mb-6">Top up sedang diproses ke akunmu</p>

          <div className="card-base p-5 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Invoice</span><span className="font-mono text-xs">{order.invoice}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Game</span><span className="font-medium">{order.game?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-bold text-primary-600">{formatCurrency(order.total)}</span></div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/orders")} fullWidth>Riwayat</Button>
            <Button onClick={() => router.push("/games")} fullWidth>Top Up Lagi</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menunggu Pembayaran</h1>
          <p className="text-sm text-gray-500 mt-1">Selesaikan sebelum waktu habis</p>
        </div>

        {/* Countdown */}
        <Card padding="sm" className="text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">Sisa Waktu</p>
          <p className={`text-2xl font-bold font-mono tracking-wider ${countdown < 300 ? "text-red-500" : "text-primary-600"}`}>
            {fmtCountdown(countdown)}
          </p>
        </Card>

        {/* Payment */}
        <Card padding="md" className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">QRIS</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">Simulasi</span>
          </div>

          {payLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : payData ? (
            <>
              <div className="flex justify-center">
                <div className="w-44 h-44 rounded-xl bg-white border-2 border-gray-100 dark:border-gray-800 p-2 shadow-sm">
                  <img src={payData.qrCode} alt="QR" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <InfoRow label="Invoice" value={payData.invoice} mono />
                <InfoRow label="Game" value={payData.gameName} />
                <InfoRow label="Nominal" value={payData.nominalName} />
                <InfoRow label="Total" value={formatCurrency(payData.amount)} primary />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed">
                  Status akan berubah otomatis menjadi <strong>Berhasil</strong> dalam beberapa detik.
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-gray-400 py-6">Memuat pembayaran...</p>
          )}
        </Card>

        <Button variant="outline" fullWidth onClick={() => router.push("/orders")}>
          Lihat Riwayat Pesanan
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono, primary }: { label: string; value: string; mono?: boolean; primary?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${mono ? "font-mono text-xs" : ""} ${primary ? "text-primary-600 font-bold text-sm" : "text-gray-900 dark:text-gray-100"}`}>{value}</span>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 pb-16 max-w-lg mx-auto px-4">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
