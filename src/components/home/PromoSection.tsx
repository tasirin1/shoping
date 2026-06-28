"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tag, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { PromoType } from "@/types"

export function PromoSection() {
  const [promos, setPromos] = useState<PromoType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/promos?active=true")
        const data = await res.json()
        if (data.success) setPromos(data.data || [])
      } catch {} finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-6 w-32 mb-5" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-64 rounded-2xl flex-shrink-0" />)}
          </div>
        </div>
      </section>
    )
  }

  if (promos.length === 0) return null

  return (
    <section className="py-8 md:py-12 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Promo</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {promos.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-64">
              <Card padding="sm" hover className="h-full">
                <div className="space-y-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    {promo.code}
                  </span>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{promo.name}</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {promo.discountType === "PERCENTAGE"
                      ? `${promo.discount}%`
                      : formatCurrency(promo.discount)}
                    <span className="text-xs font-normal text-gray-400 ml-1">OFF</span>
                  </p>
                  {promo.endDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(promo.endDate).toLocaleDateString("id-ID")}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
