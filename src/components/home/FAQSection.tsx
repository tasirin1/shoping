"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Bagaimana cara melakukan top up?",
    answer: "Pilih game yang ingin di top up, pilih nominal, masukkan User ID game, pilih metode pembayaran, dan selesaikan pembayaran. Saldo akan masuk secara otomatis.",
  },
  {
    question: "Berapa lama proses top up?",
    answer: "Proses top up biasanya berlangsung 1-5 menit setelah pembayaran dikonfirmasi. Untuk beberapa game mungkin membutuhkan waktu lebih lama.",
  },
  {
    question: "Apakah data saya aman?",
    answer: "Ya, keamanan data Anda adalah prioritas kami. Semua transaksi dilindungi dengan enkripsi dan kami tidak menyimpan informasi sensitif Anda.",
  },
  {
    question: "Bagaimana jika top up gagal?",
    answer: "Jika top up gagal, dana akan dikembalikan secara otomatis ke saldo Anda dalam 1x24 jam. Hubungi customer support jika ada kendala.",
  },
  {
    question: "Apa saja metode pembayaran yang tersedia?",
    answer: "Kami mendukung berbagai metode pembayaran termasuk QRIS, GoPay, OVO, DANA, transfer bank, dan lainnya.",
  },
  {
    question: "Apakah ada minimal top up?",
    answer: "Minimal top up bervariasi tergantung game dan nominal yang dipilih. Umumnya mulai dari Rp5.000.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            FAQ
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Pertanyaan yang sering diajukan
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
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
