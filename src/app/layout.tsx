import type { Metadata } from "next"
import { Inter } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Providers } from "@/components/layout/Providers"

const inter = Inter({ subsets: ["latin"], display: "swap" })

// Lazy load Footer since it's below the fold
const Footer = dynamic(() => import("@/components/layout/Footer").then((m) => ({ default: m.Footer })), {
  ssr: true,
})

export const metadata: Metadata = {
  title: "Shoping - Top Up Game",
  description: "Top up game cepat & aman. Harga terbaik, proses instan.",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
