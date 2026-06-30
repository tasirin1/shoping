"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { DetailSkeleton } from "@/components/ui/Skeleton"
import { formatCurrency, cn } from "@/lib/utils"
import {
  ChevronLeft, Check, User, Wallet, ShoppingCart,
  AlertCircle, Gamepad2
} from "lucide-react"
import type { GameType, NominalType, PaymentMethodType } from "@/types"

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()

  const [game, setGame] = useState<GameType | null>(null)
  const [payments, setPayments] = useState<PaymentMethodType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedNominal, setSelectedNominal] = useState<NominalType | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType | null>(null)
  const [playerId, setPlayerId] = useState("")
  const [nickname, setNickname] = useState<string | null>(null)
  const [checkingNick, setCheckingNick] = useState(false)
  const [nickError, setNickError] = useState("")
  const [ordering, setOrdering] = useState(false)

  useEffect(() => {
     
    const loadData = async () => {
      try {
        const [gRes, pRes] = await Promise.all([
          fetch(`/api/games/${slug}`),
          fetch("/api/payment-methods"),
        ])
        const gData = await gRes.json()
        const pData = await pRes.json()
        if (gData.success) setGame(gData.data)
        else setError("Game tidak ditemukan")
        if (pData.success) setPayments(pData.data || [])
      } catch {
        setError("Gagal memuat data. Coba lagi.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const checkNickname = async () => {
    if (!playerId.trim()) { setNickError("Masukkan User ID"); return }
    setCheckingNick(true)
    setNickError("")
    try {
      const res = await fetch("/api/check-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: slug, playerId: playerId.trim() }),
      })
      const d = await res.json()
      if (d.success) setNickname(d.data.nickname)
      else setNickError("Cek nickname gagal")
    } catch {
      setNickError("Terjadi kesalahan")
    } finally {
      setCheckingNick(false)
    }
  }

  const handleOrder = async () => {
    if (!selectedNominal || !playerId.trim() || !game) return
    setOrdering(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
          nominalId: selectedNominal.id,
          paymentMethodId: selectedPayment?.id || null,
          playerId: playerId.trim(),
        }),
      })
      const d = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return }
        alert(d.error || "Gagal membuat pesanan")
        return
      }
      router.push(`/checkout?orderId=${d.data.id}`)
    } catch {
      alert("Terjadi kesalahan. Coba lagi.")
    } finally {
      setOrdering(false)
    }
  }

  if (loading) return <div className="min-h-screen pt-20 pb-16 max-w-4xl mx-auto px-4"><DetailSkeleton /></div>

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Game tidak ditemukan</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/games")}>Cari Game Lain</Button>
        </div>
      </div>
    )
  }

  const fee = selectedNominal ? Math.round(selectedNominal.price * 0.01) : 0
  const total = selectedNominal ? selectedNominal.price + fee : 0

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Game header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden shrink-0">
            {game.icon ? (
              <img src={game.icon} alt={game.name} className="w-full h-full object-cover" />
            ) : (
              <Gamepad2 className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{game.name}</h1>
            {game.description && <p className="text-sm text-gray-500 mt-0.5">{game.description}</p>}
          </div>
        </div>

        {/* 3-step flow: ID → Nominal → Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Step 1: User ID */}
            <Card padding="md">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                User ID Game
              </h3>
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => { setPlayerId(e.target.value); setNickname(null) }}
                      placeholder="Masukkan ID"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500"
                    />
                  </div>
                  <Button variant="secondary" onClick={checkNickname} loading={checkingNick} size="md" className="shrink-0">
                    Cek
                  </Button>
                </div>
                {nickError && <p className="text-xs text-red-500">{nickError}</p>}
                {nickname && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 animate-fadeIn">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">Nickname: {nickname}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Step 2: Nominal */}
            <Card padding="md">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                Pilih Nominal
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {game.nominals?.map((nom) => (
                  <button
                    key={nom.id}
                    onClick={() => setSelectedNominal(nom)}
                    className={cn(
                      "relative p-3.5 rounded-xl border text-left transition-all duration-150",
                      selectedNominal?.id === nom.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                    )}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{nom.name}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(nom.price)}
                      </span>
                      {nom.originalPrice && nom.originalPrice > nom.price && (
                        <span className="text-[10px] text-gray-400 line-through">{formatCurrency(nom.originalPrice)}</span>
                      )}
                    </div>
                    {selectedNominal?.id === nom.id && (
                      <Check className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
              {(!game.nominals || game.nominals.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-6">Belum ada nominal</p>
              )}
            </Card>

            {/* Step 3: Payment */}
            <Card padding="md">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                Pembayaran
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {payments.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all duration-150",
                      selectedPayment?.id === pm.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{pm.name}</p>
                      <p className="text-[10px] text-gray-400">{pm.type}</p>
                    </div>
                    {selectedPayment?.id === pm.id && (
                      <Check className="w-3.5 h-3.5 text-primary-600 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card padding="md" className="bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Ringkasan
                </h3>

                <div className="space-y-2.5 text-sm">
                  <Row label="Game" value={game.name} />
                  <Row label="User ID" value={playerId || <span className="text-gray-400">-</span>} />
                  <Row label="Nominal" value={selectedNominal?.name || <span className="text-gray-400">Pilih</span>} />
                  <Row label="Harga" value={selectedNominal ? formatCurrency(selectedNominal.price) : <span className="text-gray-400">-</span>} />
                  <Row label="Biaya" value={selectedNominal ? formatCurrency(fee) : <span className="text-gray-400">-</span>} />
                  <Row label="Pembayaran" value={selectedPayment?.name || <span className="text-gray-400">Pilih</span>} />

                  {selectedNominal && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatCurrency(total)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-5"
                  disabled={!selectedNominal || !playerId.trim() || ordering}
                  loading={ordering}
                  onClick={handleOrder}
                >
                  {ordering ? "Memproses..." : "Bayar Sekarang"}
                </Button>

                {(!selectedNominal || !playerId.trim()) && (
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    {!playerId.trim() ? "Masukkan User ID" : !selectedNominal ? "Pilih nominal" : ""}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}
