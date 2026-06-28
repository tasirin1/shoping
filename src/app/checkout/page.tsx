"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils"
import { CheckCircle, Clock, AlertCircle, Copy, ExternalLink, ArrowLeft, Loader2 } from "lucide-react"
import type { OrderType } from "@/types"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [countdown, setCountdown] = useState(24 * 60 * 60) // 24 hours
  const [status, setStatus] = useState("PENDING")

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?limit=1`)
        const data = await res.json()
        if (data.success) {
          const found = data.data.find((o: OrderType) => o.id === orderId)
          if (found) {
            setOrder(found)
            setStatus(found.status)
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (!order || status !== "PENDING") return

    const initPayment = async () => {
      setPaymentLoading(true)
      try {
        const res = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })
        const data = await res.json()
        if (data.success) {
          setPaymentData(data.data)
          // Set countdown from expiresAt
          const expires = new Date(data.data.expiresAt).getTime()
          const now = Date.now()
          setCountdown(Math.max(0, Math.floor((expires - now) / 1000)))
        }
      } catch {
        // ignore
      } finally {
        setPaymentLoading(false)
      }
    }
    initPayment()
  }, [order, status])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || status !== "PENDING") return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown, status])

  // Mock webhook: simulate payment success after 30 seconds
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
      } catch {
        // ignore
      }
    }, 30000)
    return () => clearTimeout(timer)
  }, [order, status])

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pesanan tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">Silakan buat pesanan terlebih dahulu</p>
          <Button onClick={() => router.push("/games")}>Lihat Game</Button>
        </div>
      </div>
    )
  }

  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-500 mb-2">Top up sedang diproses</p>
            <p className="text-sm text-gray-400 mb-6">Invoice: {order.invoice}</p>
            <div className="space-y-2 text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Game</span><span className="font-medium">{order.game?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Nominal</span><span className="font-medium">{order.nominal?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-bold text-primary-600">{formatCurrency(order.total)}</span></div>
            </div>
            <Button onClick={() => router.push("/orders")}>Lihat Riwayat Pesanan</Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menunggu Pembayaran</h1>
          <p className="text-gray-500 mt-2">Selesaikan pembayaran sebelum waktu habis</p>
        </div>

        {/* Countdown */}
        <Card className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">Sisa Waktu</p>
          <p className={`text-3xl font-bold font-mono ${countdown < 300 ? "text-red-600" : "text-primary-600"}`}>
            {formatCountdown(countdown)}
          </p>
        </Card>

        {/* Payment Info */}
        <Card className="space-y-4 mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Pembayaran QRIS</h3>
            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">Mock</span>
          </div>

          {paymentLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : paymentData ? (
            <>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-xl bg-white border-2 border-gray-200 dark:border-gray-700 p-2">
                  <img
                    src={paymentData.qrCode}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Invoice</span>
                  <span className="font-mono font-medium">{paymentData.invoice}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Game</span>
                  <span className="font-medium">{paymentData.gameName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Nominal</span>
                  <span className="font-medium">{paymentData.nominalName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Biaya Layanan</span>
                  <span className="font-medium">{formatCurrency(paymentData.fee)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Total Pembayaran</span>
                  <span className="font-bold text-lg text-primary-600">{formatCurrency(paymentData.amount)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <strong>Catatan:</strong> Ini adalah simulasi pembayaran. Status akan otomatis berubah menjadi "Berhasil" dalam 30 detik.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Memuat pembayaran...</p>
            </div>
          )}
        </Card>

        <Button variant="outline" fullWidth onClick={() => router.push("/orders")}>
          Lihat Riwayat Pesanan
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 max-w-2xl mx-auto px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
