"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tag, Clock } from "lucide-react"
import type { PromoType } from "@/types"

export function PromoSection() {
  const [promos, setPromos] = useState<PromoType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promos?active=true")
        const data = await res.json()
        if (data.success) {
          setPromos(data.data || [])
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchPromos()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (promos.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Promo Spesial
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <Card key={promo.id} hover>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    {promo.code}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {promo.name}
                  </h3>
                  {promo.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {promo.description}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {promo.discountType === "PERCENTAGE"
                      ? `${promo.discount}%`
                      : `Rp${promo.discount.toLocaleString()}`}
                    <span className="text-sm font-normal text-gray-400 ml-1">OFF</span>
                  </p>
                </div>
              </div>
              {promo.endDate && (
                <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  Berakhir: {new Date(promo.endDate).toLocaleDateString("id-ID")}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
