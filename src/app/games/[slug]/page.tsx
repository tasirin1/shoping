"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { DetailSkeleton } from "@/components/ui/Skeleton"
import { formatCurrency, cn } from "@/lib/utils"
import { Check, ChevronLeft, Wallet, User, ShoppingCart, Loader2 } from "lucide-react"
import type { GameType, NominalType, PaymentMethodType } from "@/types"

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()

  const [game, setGame] = useState<GameType | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedNominal, setSelectedNominal] = useState<NominalType | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType | null>(null)
  const [playerId, setPlayerId] = useState("")
  const [nickname, setNickname] = useState<string | null>(null)
  const [checkingNickname, setCheckingNickname] = useState(false)
  const [nicknameError, setNicknameError] = useState("")
  const [creatingOrder, setCreatingOrder] = useState(false)

  const totalPrice = selectedNominal
    ? selectedNominal.price + Math.round(selectedNominal.price * 0.01)
    : 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, paymentRes] = await Promise.all([
          fetch(`/api/games/${slug}`),
          fetch("/api/payment-methods"),
        ])
        const gameData = await gameRes.json()
        const paymentData = await paymentRes.json()

        if (gameData.success) setGame(gameData.data)
        else setError("Game tidak ditemukan")

        if (paymentData.success) setPaymentMethods(paymentData.data || [])
      } catch {
        setError("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const checkNickname = async () => {
    if (!playerId.trim()) {
      setNicknameError("Masukkan User ID")
      return
    }
    setCheckingNickname(true)
    setNicknameError("")
    try {
      const res = await fetch("/api/check-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: slug, playerId: playerId.trim() }),
      })
      const data = await res.json()
      if (data.success) setNickname(data.data.nickname)
      else setNicknameError("Cek nickname gagal")
    } catch {
      setNicknameError("Terjadi kesalahan")
    } finally {
      setCheckingNickname(false)
    }
  }

  const handleOrder = async () => {
    if (!selectedNominal || !playerId.trim()) return
    setCreatingOrder(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game!.id,
          nominalId: selectedNominal.id,
          paymentMethodId: selectedPayment?.id || null,
          playerId: playerId.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return }
        alert(data.error || "Gagal")
        return
      }
      router.push(`/checkout?orderId=${data.data.id}`)
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setCreatingOrder(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4"><DetailSkeleton /></div>
    </div>
  )

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{error || "Game tidak ditemukan"}</p>
          <Button onClick={() => router.push("/games")}>Cari Game Lain</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Game name & icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
            {game.icon ? (
              <img src={game.icon} alt={game.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-300 dark:text-gray-600">{game.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{game.name}</h1>
            {game.description && (
              <p className="text-xs text-gray-400">{game.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left - Pilih Nominal & Payment */}
          <div className="md:col-span-3 space-y-5">
            {/* Step 1: User ID */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-medium">1</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Masukkan User ID</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => { setPlayerId(e.target.value); setNickname(null) }}
                  placeholder="Contoh: 123456789"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder-gray-400"
                />
                <Button variant="secondary" onClick={checkNickname} loading={checkingNickname} size="sm">
                  Cek
                </Button>
              </div>
              {nicknameError && <p className="text-xs text-red-500 mt-1.5">{nicknameError}</p>}
              {nickname && (
                <div className="mt-2 p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Nickname: <strong>{nickname}</strong>
                  </p>
                </div>
              )}
            </Card>

            {/* Step 2: Pilih Nominal */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-medium">2</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Pilih Nominal</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {game.nominals?.map((nominal) => (
                  <button
                    key={nominal.id}
                    onClick={() => setSelectedNominal(nominal)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-150",
                      selectedNominal?.id === nominal.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{nominal.name}</p>
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(nominal.price)}
                        </p>
                        {nominal.originalPrice && nominal.originalPrice > nominal.price && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatCurrency(nominal.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedNominal?.id === nominal.id && (
                      <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              {(!game.nominals || game.nominals.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada nominal</p>
              )}
            </Card>

            {/* Step 3: Pembayaran */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-medium">3</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Pilih Pembayaran</h3>
              </div>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150",
                      selectedPayment?.id === method.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      {method.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{method.name}</p>
                      <p className="text-xs text-gray-400">{method.type}</p>
                    </div>
                    {selectedPayment?.id === method.id && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - Ringkasan (Sticky) */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-24 space-y-4">
              <Card padding="md" className="bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Ringkasan
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Game</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{game.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{playerId || "-"}</span>
                  </div>
                  {selectedNominal && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nominal</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{selectedNominal.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Harga</span>
                        <span>{formatCurrency(selectedNominal.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Biaya</span>
                        <span>{formatCurrency(Math.round(selectedNominal.price * 0.01))}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2.5 flex justify-between">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </>
                  )}
                  {!selectedNominal && (
                    <p className="text-xs text-gray-400 italic">Pilih nominal terlebih dahulu</p>
                  )}
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-5"
                  disabled={!selectedNominal || !playerId.trim() || creatingOrder}
                  loading={creatingOrder}
                  onClick={handleOrder}
                >
                  {creatingOrder ? "Memproses..." : "Bayar Sekarang"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
