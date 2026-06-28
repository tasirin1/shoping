import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@shoping.com" },
    update: {},
    create: {
      email: "admin@shoping.com",
      username: "admin",
      password: adminPassword,
      name: "Admin Shoping",
      role: "ADMIN",
    },
  })
  console.log("Admin created:", admin.email)

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 12)
  const user = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      email: "user@demo.com",
      username: "demo",
      password: userPassword,
      name: "Demo User",
      role: "USER",
    },
  })
  console.log("Demo user created:", user.email)

  // Create games
  const games = [
    {
      slug: "mobile-legends",
      name: "Mobile Legends",
      description: "Top up Diamond Mobile Legends dengan harga terbaik",
      category: "MOBA",
      popular: true,
      nominals: [
        { name: "86 Diamonds", amount: 86, price: 19000, originalPrice: 21000 },
        { name: "172 Diamonds", amount: 172, price: 37000, originalPrice: 42000 },
        { name: "257 Diamonds", amount: 257, price: 55000, originalPrice: 63000 },
        { name: "344 Diamonds", amount: 344, price: 73000, originalPrice: 84000 },
        { name: "429 Diamonds", amount: 429, price: 91000, originalPrice: 105000 },
        { name: "514 Diamonds", amount: 514, price: 109000, originalPrice: 126000 },
        { name: "706 Diamonds", amount: 706, price: 149000, originalPrice: 168000 },
        { name: "1050 Diamonds", amount: 1050, price: 219000, originalPrice: 250000 },
      ],
    },
    {
      slug: "free-fire",
      name: "Free Fire",
      description: "Top up Diamond Free Fire murah dan cepat",
      category: "Battle Royale",
      popular: true,
      nominals: [
        { name: "70 Diamonds", amount: 70, price: 8000, originalPrice: 10000 },
        { name: "140 Diamonds", amount: 140, price: 15000, originalPrice: 18000 },
        { name: "355 Diamonds", amount: 355, price: 37000, originalPrice: 44000 },
        { name: "720 Diamonds", amount: 720, price: 73000, originalPrice: 85000 },
        { name: "1450 Diamonds", amount: 1450, price: 146000, originalPrice: 160000 },
        { name: "2000 Diamonds", amount: 2000, price: 200000, originalPrice: 220000 },
      ],
    },
    {
      slug: "pubg-mobile",
      name: "PUBG Mobile",
      description: "Top up UC PUBG Mobile termurah",
      category: "Battle Royale",
      popular: true,
      nominals: [
        { name: "60 UC", amount: 60, price: 17000, originalPrice: 20000 },
        { name: "180 UC", amount: 180, price: 48000, originalPrice: 55000 },
        { name: "325 UC", amount: 325, price: 82000, originalPrice: 95000 },
        { name: "660 UC", amount: 660, price: 160000, originalPrice: 180000 },
        { name: "1800 UC", amount: 1800, price: 410000, originalPrice: 450000 },
        { name: "3850 UC", amount: 3850, price: 820000, originalPrice: 880000 },
      ],
    },
    {
      slug: "valorant",
      name: "Valorant",
      description: "Top up Valorant Points dengan harga bersahabat",
      category: "FPS",
      popular: true,
      nominals: [
        { name: "475 VP", amount: 475, price: 55000, originalPrice: 65000 },
        { name: "1000 VP", amount: 1000, price: 110000, originalPrice: 130000 },
        { name: "2050 VP", amount: 2050, price: 220000, originalPrice: 250000 },
        { name: "3650 VP", amount: 3650, price: 385000, originalPrice: 420000 },
        { name: "5350 VP", amount: 5350, price: 550000, originalPrice: 600000 },
        { name: "11000 VP", amount: 11000, price: 1100000, originalPrice: 1200000 },
      ],
    },
    {
      slug: "genshin-impact",
      name: "Genshin Impact",
      description: "Top up Genesis Crystal Genshin Impact",
      category: "RPG",
      popular: true,
      nominals: [
        { name: "60 Genesis Crystal", amount: 60, price: 15000, originalPrice: 18000 },
        { name: "300 Genesis Crystal", amount: 300, price: 73000, originalPrice: 85000 },
        { name: "980 Genesis Crystal", amount: 980, price: 235000, originalPrice: 260000 },
        { name: "1980 Genesis Crystal", amount: 1980, price: 470000, originalPrice: 510000 },
        { name: "3280 Genesis Crystal", amount: 3280, price: 770000, originalPrice: 830000 },
        { name: "6480 Genesis Crystal", amount: 6480, price: 1500000, originalPrice: 1600000 },
      ],
    },
    {
      slug: "honor-of-kings",
      name: "Honor of Kings",
      description: "Top up Honor of Kings termurah",
      category: "MOBA",
      popular: true,
      nominals: [
        { name: "10 Points", amount: 10, price: 3000 },
        { name: "60 Points", amount: 60, price: 15000 },
        { name: "180 Points", amount: 180, price: 42000 },
        { name: "300 Points", amount: 300, price: 70000 },
        { name: "980 Points", amount: 980, price: 220000 },
        { name: "1980 Points", amount: 1980, price: 440000 },
      ],
    },
    {
      slug: "fifa-mobile",
      name: "FIFA Mobile",
      description: "Top up FIFA Points untuk FUT",
      category: "Sports",
      nominals: [
        { name: "100 FIFA Points", amount: 100, price: 18000 },
        { name: "500 FIFA Points", amount: 500, price: 85000 },
        { name: "1050 FIFA Points", amount: 1050, price: 170000 },
        { name: "2200 FIFA Points", amount: 2200, price: 340000 },
        { name: "5600 FIFA Points", amount: 5600, price: 820000 },
      ],
    },
    {
      slug: "call-of-duty-mobile",
      name: "Call of Duty Mobile",
      description: "Top up CP CODM dengan harga murah",
      category: "FPS",
      nominals: [
        { name: "80 CP", amount: 80, price: 17000 },
        { name: "420 CP", amount: 420, price: 83000 },
        { name: "880 CP", amount: 880, price: 170000 },
        { name: "2400 CP", amount: 2400, price: 420000 },
        { name: "5000 CP", amount: 5000, price: 830000 },
      ],
    },
  ]

  for (const gameData of games) {
    const { nominals, ...gameInfo } = gameData
    const game = await prisma.game.upsert({
      where: { slug: gameInfo.slug },
      update: {},
      create: gameInfo,
    })

    for (const nominal of nominals) {
      await prisma.nominal.create({
        data: {
          gameId: game.id,
          ...nominal,
        },
      })
    }
    console.log(`Game created: ${game.name} with ${nominals.length} nominals`)
  }

  // Create payment methods
  const paymentMethods = [
    { name: "QRIS", type: "QRIS" },
    { name: "GoPay", type: "EWALLET" },
    { name: "OVO", type: "EWALLET" },
    { name: "DANA", type: "EWALLET" },
    { name: "Bank BCA", type: "VIRTUAL_ACCOUNT" },
    { name: "Bank Mandiri", type: "VIRTUAL_ACCOUNT" },
    { name: "Bank BRI", type: "VIRTUAL_ACCOUNT" },
    { name: "Bank BNI", type: "VIRTUAL_ACCOUNT" },
  ]

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.create({ data: pm })
  }
  console.log("Payment methods created")

  // Create promo
  const promos = [
    { code: "WELCOME10", name: "Welcome Bonus 10%", description: "Diskon 10% untuk pembelian pertama", discount: 10, discountType: "PERCENTAGE", maxDiscount: 50000, maxUses: 100, usedCount: 5 },
    { code: "TOPUP20", name: "Top Up 20%", description: "Diskon 20% untuk top up minimal Rp50.000", discount: 20, discountType: "PERCENTAGE", minPurchase: 50000, maxDiscount: 100000, maxUses: 50 },
    { code: "FREESHIP", name: "Free Ongkir", description: "Bebas biaya layanan", discount: 100, discountType: "PERCENTAGE", maxDiscount: 5000, maxUses: 200, usedCount: 10 },
  ]

  for (const promo of promos) {
    await prisma.promo.create({ data: promo })
  }
  console.log("Promos created")

  // Create FAQ
  const faqs = [
    { question: "Bagaimana cara melakukan top up?", answer: "Pilih game yang ingin di top up, pilih nominal, masukkan User ID game, pilih metode pembayaran, dan selesaikan pembayaran. Saldo akan masuk secara otomatis.", position: 1 },
    { question: "Berapa lama proses top up?", answer: "Proses top up biasanya berlangsung 1-5 menit setelah pembayaran dikonfirmasi. Untuk beberapa game mungkin membutuhkan waktu lebih lama.", position: 2 },
    { question: "Apakah data saya aman?", answer: "Ya, keamanan data Anda adalah prioritas kami. Semua transaksi dilindungi dengan enkripsi dan kami tidak menyimpan informasi sensitif Anda.", position: 3 },
    { question: "Bagaimana jika top up gagal?", answer: "Jika top up gagal, dana akan dikembalikan secara otomatis ke saldo Anda dalam 1x24 jam. Hubungi customer support jika ada kendala.", position: 4 },
    { question: "Apa saja metode pembayaran yang tersedia?", answer: "Kami mendukung berbagai metode pembayaran termasuk QRIS, GoPay, OVO, DANA, transfer bank, dan lainnya.", position: 5 },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }
  console.log("FAQs created")

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
