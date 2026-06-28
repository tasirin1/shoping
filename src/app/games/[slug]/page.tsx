"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, cn } from "@/lib/utils"
import { Check, ChevronLeft, Gamepad2, Loader2, User, Wallet, ShoppingCart } from "lucide-react"
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
      setNicknameError("Masukkan User ID terlebih dahulu")
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
      if (data.success) {
        setNickname(data.data.nickname)
      } else {
        setNicknameError("Gagal cek nickname")
      }
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
        if (res.status === 401) {
          router.push("/login")
          return
        }
        alert(data.error || "Gagal membuat pesanan")
        return
      }

      router.push(`/checkout?orderId=${data.data.id}`)
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setCreatingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Gamepad2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Game tidak ditemukan
          </h2>
          <p className="text-gray-500 mb-6">{error || "Halaman tidak tersedia"}</p>
          <Button onClick={() => router.push("/games")}>Lihat Semua Game</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left - Game Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4 overflow-hidden">
                {game.icon ? (
                  <img src={game.icon} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold text-gray-300 dark:text-gray-700">{game.name.charAt(0)}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{game.name}</h1>
              {game.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{game.description}</p>
              )}
            </Card>

            {/* Payment Methods */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Metode Pembayaran
              </h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left",
                      selectedPayment?.id === method.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      {method.name.charAt(0)}
                    </div>
                    <div className="flex-1">
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

          {/* Right - Order Form */}
          <div className="md:col-span-3 space-y-6">
            {/* Player ID */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                User ID Game
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => { setPlayerId(e.target.value); setNickname(null) }}
                    placeholder="Masukkan User ID"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <Button variant="secondary" onClick={checkNickname} loading={checkingNickname} size="sm">
                    Cek
                  </Button>
                </div>
                {nicknameError && <p className="text-sm text-red-500">{nicknameError}</p>}
                {nickname && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Nickname: <strong>{nickname}</strong>
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Select Nominal */}
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Pilih Nominal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {game.nominals?.map((nominal) => (
                  <button
                    key={nominal.id}
                    onClick={() => setSelectedNominal(nominal)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all duration-200",
                      selectedNominal?.id === nominal.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500 ring-2 ring-primary-500/20"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                    )}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{nominal.name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(nominal.price)}
                      </p>
                      {nominal.originalPrice && nominal.originalPrice > nominal.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatCurrency(nominal.originalPrice)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {(!game.nominals || game.nominals.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada nominal tersedia</p>
              )}
            </Card>

            {/* Order Summary */}
            <Card className="bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Ringkasan Pesanan</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Game</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{game.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{playerId || "-"}</span>
                </div>
                {selectedNominal && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nominal</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedNominal.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Harga</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(selectedNominal.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Biaya Layanan</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(Math.round(selectedNominal.price * 0.01))}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                      <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                        {formatCurrency(selectedNominal.price + Math.round(selectedNominal.price * 0.01))}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button
                fullWidth
                size="lg"
                className="mt-6"
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
  )
}
