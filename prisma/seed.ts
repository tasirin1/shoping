import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const demoPassword = await bcrypt.hash("demo123", 12)

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      email: "admin@shoping.com",
      username: "admin",
      password: adminPassword,
      name: "Admin Shoping",
      role: "ADMIN",
      phone: "",
      avatar: "",
    },
  })
  if (adminUser.createdAt === adminUser.updatedAt) {
    console.log("  ✓ Admin account created (admin / admin123)")
  } else {
    console.log("  ✓ Admin account already exists")
  }

  const demoUser = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      email: "demo@shoping.com",
      username: "demo",
      password: demoPassword,
      name: "Demo User",
      role: "USER",
      phone: "",
      avatar: "",
    },
  })
  if (demoUser.createdAt === demoUser.updatedAt) {
    console.log("  ✓ Demo account created (demo / demo123)")
  } else {
    console.log("  ✓ Demo account already exists")
  }

  // Create categories
  const categories = [
    { name: "MOBA", slug: "moba", icon: "", sortOrder: 0 },
    { name: "Battle Royale", slug: "battle-royale", icon: "", sortOrder: 1 },
    { name: "FPS", slug: "fps", icon: "", sortOrder: 2 },
    { name: "RPG", slug: "rpg", icon: "", sortOrder: 3 },
  ]
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Create games
  const games = [
    { slug: "mobile-legends", name: "Mobile Legends", categoryName: "MOBA", popular: true, sortOrder: 0 },
    { slug: "free-fire", name: "Free Fire", categoryName: "Battle Royale", popular: true, sortOrder: 1 },
    { slug: "pubg-mobile", name: "PUBG Mobile", categoryName: "Battle Royale", popular: true, sortOrder: 2 },
    { slug: "genshin-impact", name: "Genshin Impact", categoryName: "RPG", popular: true, sortOrder: 3 },
    { slug: "valorant", name: "Valorant", categoryName: "FPS", popular: true, sortOrder: 4 },
    { slug: "honor-of-kings", name: "Honor of Kings", categoryName: "MOBA", popular: true, sortOrder: 5 },
    { slug: "cod-mobile", name: "Call of Duty Mobile", categoryName: "FPS", popular: false, sortOrder: 6 },
    { slug: "higgs-domino", name: "Higgs Domino", categoryName: "", popular: false, sortOrder: 7 },
  ]
  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    })
  }

  // Get game IDs for products
  const mlbb = await prisma.game.findUnique({ where: { slug: "mobile-legends" } })
  const ff = await prisma.game.findUnique({ where: { slug: "free-fire" } })
  const pubg = await prisma.game.findUnique({ where: { slug: "pubg-mobile" } })
  const gi = await prisma.game.findUnique({ where: { slug: "genshin-impact" } })
  const val = await prisma.game.findUnique({ where: { slug: "valorant" } })
  const hok = await prisma.game.findUnique({ where: { slug: "honor-of-kings" } })
  const codm = await prisma.game.findUnique({ where: { slug: "cod-mobile" } })
  const hd = await prisma.game.findUnique({ where: { slug: "higgs-domino" } })

  // Products by game
  const nominalData: { gameId: string; name: string; amount: number; price: number; stock: number }[] = []
  if (mlbb) nominalData.push(
    { gameId: mlbb.id, name: "86 Diamonds", amount: 86, price: 15000, stock: -1 },
    { gameId: mlbb.id, name: "172 Diamonds", amount: 172, price: 30000, stock: -1 },
    { gameId: mlbb.id, name: "344 Diamonds", amount: 344, price: 60000, stock: -1 },
    { gameId: mlbb.id, name: "706 Diamonds", amount: 706, price: 120000, stock: -1 },
  )
  if (ff) nominalData.push(
    { gameId: ff.id, name: "70 Diamonds", amount: 70, price: 10000, stock: -1 },
    { gameId: ff.id, name: "140 Diamonds", amount: 140, price: 20000, stock: -1 },
    { gameId: ff.id, name: "355 Diamonds", amount: 355, price: 50000, stock: -1 },
    { gameId: ff.id, name: "720 Diamonds", amount: 720, price: 100000, stock: -1 },
  )
  if (pubg) nominalData.push(
    { gameId: pubg.id, name: "60 UC", amount: 60, price: 12000, stock: -1 },
    { gameId: pubg.id, name: "300 UC", amount: 300, price: 55000, stock: -1 },
    { gameId: pubg.id, name: "600 UC", amount: 600, price: 110000, stock: -1 },
  )
  if (gi) nominalData.push(
    { gameId: gi.id, name: "60 Genesis Crystals", amount: 60, price: 15000, stock: -1 },
    { gameId: gi.id, name: "300 Genesis Crystals", amount: 300, price: 75000, stock: -1 },
    { gameId: gi.id, name: "980 Genesis Crystals", amount: 980, price: 240000, stock: -1 },
  )
  if (val) nominalData.push(
    { gameId: val.id, name: "475 VP", amount: 475, price: 25000, stock: -1 },
    { gameId: val.id, name: "1000 VP", amount: 1000, price: 50000, stock: -1 },
    { gameId: val.id, name: "2050 VP", amount: 2050, price: 100000, stock: -1 },
  )
  if (hok) nominalData.push(
    { gameId: hok.id, name: "60 Tokens", amount: 60, price: 12000, stock: -1 },
    { gameId: hok.id, name: "300 Tokens", amount: 300, price: 55000, stock: -1 },
    { gameId: hok.id, name: "980 Tokens", amount: 980, price: 175000, stock: -1 },
  )
  if (codm) nominalData.push(
    { gameId: codm.id, name: "80 CP", amount: 80, price: 10000, stock: -1 },
    { gameId: codm.id, name: "420 CP", amount: 420, price: 50000, stock: -1 },
    { gameId: codm.id, name: "880 CP", amount: 880, price: 100000, stock: -1 },
  )
  if (hd) nominalData.push(
    { gameId: hd.id, name: "1 Chip", amount: 1, price: 1000, stock: -1 },
    { gameId: hd.id, name: "10 Chips", amount: 10, price: 10000, stock: -1 },
    { gameId: hd.id, name: "100 Chips", amount: 100, price: 95000, stock: -1 },
  )

  for (const nom of nominalData) {
    const existing = await prisma.product.findFirst({
      where: { gameId: nom.gameId, name: nom.name },
    })
    if (!existing) {
      await prisma.product.create({ data: nom })
    }
  }

  // Payment methods
  const payments = [
    { name: "QRIS", type: "QRIS", icon: "", accountNumber: "", accountName: "Shoping", sortOrder: 0 },
    { name: "GoPay", type: "EWALLET", icon: "", accountNumber: "081234567890", accountName: "Shoping", sortOrder: 1 },
    { name: "OVO", type: "EWALLET", icon: "", accountNumber: "081234567890", accountName: "Shoping", sortOrder: 2 },
    { name: "DANA", type: "EWALLET", icon: "", accountNumber: "081234567890", accountName: "Shoping", sortOrder: 3 },
    { name: "Transfer BCA", type: "VIRTUAL_ACCOUNT", icon: "", accountNumber: "1234567890", accountName: "PT Shoping", sortOrder: 4 },
    { name: "Transfer Mandiri", type: "VIRTUAL_ACCOUNT", icon: "", accountNumber: "1234567890", accountName: "PT Shoping", sortOrder: 5 },
  ]
  for (const pm of payments) {
    const existing = await prisma.paymentMethod.findFirst({ where: { name: pm.name } })
    if (!existing) await prisma.paymentMethod.create({ data: pm })
  }

  // Site settings
  const settings = [
    { key: "site_name", value: "Shoping" },
    { key: "site_description", value: "Platform top up game terpercaya" },
    { key: "site_logo", value: "" },
    { key: "site_favicon", value: "" },
    { key: "primary_color", value: "#2563EB" },
    { key: "footer_text", value: "Shoping. All rights reserved." },
    { key: "contact_email", value: "support@shoping.com" },
    { key: "contact_whatsapp", value: "6281234567890" },
    { key: "contact_telegram", value: "@shoping" },
    { key: "meta_title", value: "Shoping - Top Up Game" },
    { key: "meta_description", value: "Top up game cepat dan aman" },
  ]
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // Set active theme to dark
  const activeTheme = await prisma.siteSetting.findUnique({ where: { key: "theme_active_id" } })
  if (!activeTheme) {
    await prisma.siteSetting.create({ data: { key: "theme_active_id", value: "builtin_dark" } })
  }

  console.log("✅ Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
