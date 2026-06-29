"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  { q: "Bagaimana cara top up?", a: "Pilih game → pilih nominal → masukkan User ID → pilih pembayaran → bayar. Saldo masuk otomatis." },
  { q: "Berapa lama prosesnya?", a: "1-5 menit setelah pembayaran dikonfirmasi." },
  { q: "Apakah data saya aman?", a: "Ya, semua transaksi dienkripsi dan data Anda dilindungi." },
  { q: "Bagaimana jika gagal?", a: "Dana dikembalikan otomatis dalam 1x24 jam. Hubungi support jika ada kendala." },
  { q: "Pembayaran apa saja?", a: "QRIS, GoPay, OVO, DANA, dan Transfer Bank." },
  { q: "Ada minimal top up?", a: "Mulai dari Rp5.000, tergantung game." },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">FAQ</h2>
          <p className="text-sm text-gray-500 mt-1">Pertanyaan umum</p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-150">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-3.5 text-left">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-150 shrink-0", open === i && "rotate-180")} />
              </button>
              <div className={cn("grid transition-all duration-150", open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-3.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
