"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Cara top up?",
    a: "Pilih game → pilih nominal → masukkan User ID → bayar. Saldo masuk otomatis.",
  },
  {
    q: "Berapa lama prosesnya?",
    a: "1-5 menit setelah pembayaran dikonfirmasi.",
  },
  {
    q: "Data saya aman?",
    a: "Ya, semua transaksi dienkripsi dan data kamu dilindungi.",
  },
  {
    q: "Top up gagal?",
    a: "Dana dikembalikan otomatis dalam 1x24 jam. Hubungi support jika ada kendala.",
  },
  {
    q: "Minimal top up?",
    a: "Mulai dari Rp5.000, tergantung game.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-12 md:py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ada pertanyaan?
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Yang sering ditanyakan
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-400 transition-transform duration-150 flex-shrink-0",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200",
                  openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
