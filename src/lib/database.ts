import fs from "fs"
import path from "path"
import crypto from "crypto"
import bcrypt from "bcryptjs"

// ============================================================
// DATABASE SERVICE — JSON-based local database
// ============================================================

const DB_DIR = path.join(process.cwd(), "database")
const BACKUP_DIR = path.join(DB_DIR, "backups")
const LOCK_TIMEOUT = 3000

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 2000 // 2 seconds

// File lock map
const locks = new Map<string, number>()

function uuid(): string {
  return crypto.randomUUID()
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function acquireLock(filePath: string): Promise<boolean> {
  const now = Date.now()
  const lockedUntil = locks.get(filePath) || 0
  if (now < lockedUntil) return false
  locks.set(filePath, now + LOCK_TIMEOUT)
  return true
}

function releaseLock(filePath: string) {
  locks.delete(filePath)
}

function getAllCollections(): string[] {
  return [
    "users", "games", "products", "orders", "providers",
    "payments", "banners", "promos", "settings", "logs",
    "categories", "sessions",
  ]
}

// ============================================================
// CORE DATABASE CLASS
// ============================================================

class DatabaseService {
  private collections: string[] = []

  constructor() {
    this.collections = getAllCollections()
    this.ensureDirectories()
  }

  private ensureDirectories() {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })
    if (!fs.existsSync(path.join(process.cwd(), "public/uploads"))) {
      fs.mkdirSync(path.join(process.cwd(), "public/uploads"), { recursive: true })
    }
  }

  private getFilePath(collection: string): string {
    return path.join(DB_DIR, `${collection}.json`)
  }

  private async readFile(collection: string): Promise<any[]> {
    const filePath = this.getFilePath(collection)

    // Check cache first
    const cached = cache.get(filePath)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    try {
      if (!fs.existsSync(filePath)) {
        return []
      }
      const raw = fs.readFileSync(filePath, "utf-8")
      const data = JSON.parse(raw)
      cache.set(filePath, { data, timestamp: Date.now() })
      return data
    } catch {
      return []
    }
  }

  private async writeFile(collection: string, data: any[]): Promise<void> {
    const filePath = this.getFilePath(collection)

    // Wait for lock
    let attempts = 0
    while (!(await acquireLock(filePath)) && attempts < 10) {
      await wait(100)
      attempts++
    }

    try {
      // Create backup
      if (fs.existsSync(filePath)) {
        const backupName = `${collection}_${Date.now()}.json`
        fs.copyFileSync(filePath, path.join(BACKUP_DIR, backupName))

        // Clean old backups (keep last 5)
        const backups = fs.readdirSync(BACKUP_DIR)
          .filter((f) => f.startsWith(collection))
          .sort()
        while (backups.length > 5) {
          const old = backups.shift()!
          fs.unlinkSync(path.join(BACKUP_DIR, old))
        }
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
      cache.set(filePath, { data, timestamp: Date.now() })
    } finally {
      releaseLock(filePath)
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  /** Get all items from a collection */
  async getAll(collection: string): Promise<any[]> {
    return this.readFile(collection)
  }

  /** Get a single item by ID */
  async getById(collection: string, id: string): Promise<any | null> {
    const data = await this.readFile(collection)
    return data.find((item: any) => item.id === id) || null
  }

  /** Get items by a field value */
  async getBy(collection: string, field: string, value: any): Promise<any[]> {
    const data = await this.readFile(collection)
    return data.filter((item: any) => item[field] === value)
  }

  /** Find one item by a field value */
  async findOne(collection: string, field: string, value: any): Promise<any | null> {
    const data = await this.readFile(collection)
    return data.find((item: any) => item[field] === value) || null
  }

  /** Find first matching query */
  async findFirst(collection: string, query: Record<string, any>): Promise<any | null> {
    const data = await this.readFile(collection)
    return data.find((item: any) => {
      return Object.entries(query).every(([key, val]) => item[key] === val)
    }) || null
  }

  /** Find by OR condition */
  async findFirstOr(collection: string, conditions: Record<string, any>[]): Promise<any | null> {
    const data = await this.readFile(collection)
    return data.find((item: any) => {
      return conditions.some((cond) =>
        Object.entries(cond).every(([key, val]) => item[key] === val)
      )
    }) || null
  }

  /** Create a new item */
  async create(collection: string, data: Record<string, any>): Promise<any> {
    const items = await this.readFile(collection)
    const now = new Date().toISOString()
    const newItem = {
      id: uuid(),
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    items.push(newItem)
    await this.writeFile(collection, items)
    return newItem
  }

  /** Update an item by ID */
  async update(collection: string, id: string, data: Record<string, any>): Promise<any | null> {
    const items = await this.readFile(collection)
    const index = items.findIndex((item: any) => item.id === id)
    if (index === -1) return null
    const updated = {
      ...items[index],
      ...data,
      id: items[index].id, // prevent ID change
      createdAt: items[index].createdAt, // preserve createdAt
      updatedAt: new Date().toISOString(),
    }
    items[index] = updated
    await this.writeFile(collection, items)
    return updated
  }

  /** Delete an item by ID */
  async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.readFile(collection)
    const index = items.findIndex((item: any) => item.id === id)
    if (index === -1) return false
    items.splice(index, 1)
    await this.writeFile(collection, items)
    return true
  }

  /** Count items in a collection */
  async count(collection: string, query?: Record<string, any>): Promise<number> {
    const items = await this.readFile(collection)
    if (!query) return items.length
    return items.filter((item: any) =>
      Object.entries(query).every(([key, val]) => item[key] === val)
    ).length
  }

  /** Aggregate (sum) a field */
  async sum(collection: string, field: string, query?: Record<string, any>): Promise<number> {
    const items = await this.readFile(collection)
    const filtered = query
      ? items.filter((item: any) => Object.entries(query).every(([key, val]) => item[key] === val))
      : items
    return filtered.reduce((acc: number, item: any) => acc + (Number(item[field]) || 0), 0)
  }

  /** Group by and count */
  async groupBy(collection: string, field: string, limit = 5): Promise<any[]> {
    const items = await this.readFile(collection)
    const groups: Record<string, { count: number; sum: number }> = {}
    items.forEach((item: any) => {
      const key = item[field]
      if (!key) return
      if (!groups[key]) groups[key] = { count: 0, sum: 0 }
      groups[key].count++
      groups[key].sum += Number(item.total) || 0
    })
    return Object.entries(groups)
      .map(([key, val]) => ({ key, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /** Search by field containing string */
  async search(collection: string, field: string, query: string): Promise<any[]> {
    const items = await this.readFile(collection)
    const q = query.toLowerCase()
    return items.filter((item: any) =>
      String(item[field] || "").toLowerCase().includes(q)
    )
  }

  /** Paginate */
  async paginate(collection: string, page = 1, limit = 10, sortField = "createdAt", sortOrder: "asc" | "desc" = "desc"): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    let items = await this.readFile(collection)
    const total = items.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    items.sort((a: any, b: any) => {
      const aVal = a[sortField] || ""
      const bVal = b[sortField] || ""
      if (sortOrder === "desc") return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    })

    return {
      data: items.slice(skip, skip + limit),
      total,
      page,
      limit,
      totalPages,
    }
  }

  /** Clear cache for a collection */
  clearCache(collection?: string) {
    if (collection) {
      cache.delete(this.getFilePath(collection))
    } else {
      cache.clear()
    }
  }

  /** Create backup of all collections */
  async backupAll(): Promise<string> {
    const timestamp = Date.now()
    const backupName = `full_backup_${timestamp}`
    const backupPath = path.join(BACKUP_DIR, backupName)
    fs.mkdirSync(backupPath, { recursive: true })

    for (const col of this.collections) {
      const filePath = this.getFilePath(col)
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, path.join(backupPath, `${col}.json`))
      }
    }
    return backupName
  }
}

// Singleton
const db = new DatabaseService()

// ============================================================
// SEED DATA
// ============================================================

async function seedDatabase() {
  const collections = getAllCollections()

  // Check if already seeded
  const usersExist = await db.getAll("users")
  if (usersExist.length > 0) return

  console.log("🌱 Seeding database...")

  // Users
  const adminHash = await bcrypt.hash("admin123", 12)
  const userHash = await bcrypt.hash("demo123", 12)

  await db.create("users", { email: "admin@shoping.com", username: "admin", password: adminHash, name: "Admin Shoping", role: "ADMIN", phone: "", avatar: "", suspended: false })
  await db.create("users", { email: "demo@shoping.com", username: "demo", password: userHash, name: "Demo User", role: "USER", phone: "", avatar: "", suspended: false })

  // Categories
  const catMOBA = await db.create("categories", { name: "MOBA", slug: "moba", icon: "", active: true, sortOrder: 0 })
  const catBR = await db.create("categories", { name: "Battle Royale", slug: "battle-royale", icon: "", active: true, sortOrder: 1 })
  const catFPS = await db.create("categories", { name: "FPS", slug: "fps", icon: "", active: true, sortOrder: 2 })
  const catRPG = await db.create("categories", { name: "RPG", slug: "rpg", icon: "", active: true, sortOrder: 3 })

  // Games
  const games = [
    { slug: "mobile-legends", name: "Mobile Legends", description: "Top up Diamond Mobile Legends", category: "MOBA", categoryId: catMOBA.id, popular: true, active: true, icon: "", sortOrder: 0 },
    { slug: "free-fire", name: "Free Fire", description: "Top up Diamond Free Fire", category: "Battle Royale", categoryId: catBR.id, popular: true, active: true, icon: "", sortOrder: 1 },
    { slug: "pubg-mobile", name: "PUBG Mobile", description: "Top up UC PUBG Mobile", category: "Battle Royale", categoryId: catBR.id, popular: true, active: true, icon: "", sortOrder: 2 },
    { slug: "valorant", name: "Valorant", description: "Top up Valorant Points", category: "FPS", categoryId: catFPS.id, popular: true, active: true, icon: "", sortOrder: 3 },
    { slug: "genshin-impact", name: "Genshin Impact", description: "Top up Genesis Crystal", category: "RPG", categoryId: catRPG.id, popular: true, active: true, icon: "", sortOrder: 4 },
    { slug: "honor-of-kings", name: "Honor of Kings", description: "Top up Honor of Kings", category: "MOBA", categoryId: catMOBA.id, popular: false, active: true, icon: "", sortOrder: 5 },
    { slug: "call-of-duty-mobile", name: "Call of Duty Mobile", description: "Top up CP CODM", category: "FPS", categoryId: catFPS.id, popular: false, active: true, icon: "", sortOrder: 6 },
    { slug: "fifa-mobile", name: "FIFA Mobile", description: "Top up FIFA Points", category: "Sports", active: true, icon: "", sortOrder: 7 },
  ]

  const createdGames: any[] = []
  for (const g of games) {
    const game = await db.create("games", g as any)
    createdGames.push(game)
  }

  // Nominals (as products)
  const nominalsData: { gameSlug: string; items: { name: string; amount: number; price: number; originalPrice?: number }[] }[] = [
    { gameSlug: "mobile-legends", items: [
      { name: "86 Diamonds", amount: 86, price: 19000, originalPrice: 21000 },
      { name: "172 Diamonds", amount: 172, price: 37000, originalPrice: 42000 },
      { name: "344 Diamonds", amount: 344, price: 73000, originalPrice: 84000 },
      { name: "514 Diamonds", amount: 514, price: 109000, originalPrice: 126000 },
      { name: "706 Diamonds", amount: 706, price: 149000, originalPrice: 168000 },
      { name: "1050 Diamonds", amount: 1050, price: 219000, originalPrice: 250000 },
    ]},
    { gameSlug: "free-fire", items: [
      { name: "70 Diamonds", amount: 70, price: 8000, originalPrice: 10000 },
      { name: "140 Diamonds", amount: 140, price: 15000, originalPrice: 18000 },
      { name: "355 Diamonds", amount: 355, price: 37000, originalPrice: 44000 },
      { name: "720 Diamonds", amount: 720, price: 73000, originalPrice: 85000 },
      { name: "1450 Diamonds", amount: 1450, price: 146000, originalPrice: 160000 },
    ]},
    { gameSlug: "pubg-mobile", items: [
      { name: "60 UC", amount: 60, price: 17000, originalPrice: 20000 },
      { name: "180 UC", amount: 180, price: 48000, originalPrice: 55000 },
      { name: "325 UC", amount: 325, price: 82000, originalPrice: 95000 },
      { name: "660 UC", amount: 660, price: 160000 },
      { name: "1800 UC", amount: 1800, price: 410000 },
    ]},
    { gameSlug: "valorant", items: [
      { name: "475 VP", amount: 475, price: 55000, originalPrice: 65000 },
      { name: "1000 VP", amount: 1000, price: 110000, originalPrice: 130000 },
      { name: "2050 VP", amount: 2050, price: 220000, originalPrice: 250000 },
    ]},
    { gameSlug: "genshin-impact", items: [
      { name: "60 Genesis Crystal", amount: 60, price: 15000 },
      { name: "300 Genesis Crystal", amount: 300, price: 73000 },
      { name: "980 Genesis Crystal", amount: 980, price: 235000 },
    ]},
    { gameSlug: "honor-of-kings", items: [
      { name: "10 Points", amount: 10, price: 3000 },
      { name: "60 Points", amount: 60, price: 15000 },
      { name: "180 Points", amount: 180, price: 42000 },
    ]},
    { gameSlug: "call-of-duty-mobile", items: [
      { name: "80 CP", amount: 80, price: 17000 },
      { name: "420 CP", amount: 420, price: 83000 },
    ]},
    { gameSlug: "fifa-mobile", items: [
      { name: "100 FIFA Points", amount: 100, price: 18000 },
      { name: "500 FIFA Points", amount: 500, price: 85000 },
    ]},
  ]

  for (const ng of nominalsData) {
    const game = createdGames.find((g: any) => g.slug === ng.gameSlug)
    if (!game) continue
    for (const n of ng.items) {
      await db.create("products", {
        gameId: game.id,
        name: n.name,
        amount: n.amount,
        price: n.price,
        originalPrice: n.originalPrice || null,
        costPrice: Math.round(n.price * 0.8),
        profit: Math.round(n.price * 0.2),
        stock: -1,
        active: true,
      })
    }
  }

  // Payment methods
  const payments = [
    { name: "QRIS", type: "QRIS", active: true, sortOrder: 0 },
    { name: "GoPay", type: "EWALLET", active: true, sortOrder: 1 },
    { name: "OVO", type: "EWALLET", active: true, sortOrder: 2 },
    { name: "DANA", type: "EWALLET", active: true, sortOrder: 3 },
    { name: "ShopeePay", type: "EWALLET", active: true, sortOrder: 4 },
    { name: "BCA", type: "VIRTUAL_ACCOUNT", active: true, sortOrder: 5 },
    { name: "Mandiri", type: "VIRTUAL_ACCOUNT", active: true, sortOrder: 6 },
    { name: "BRI", type: "VIRTUAL_ACCOUNT", active: true, sortOrder: 7 },
  ]
  for (const p of payments) {
    await db.create("payments", p)
  }

  // Promos
  await db.create("promos", { code: "WELCOME10", name: "Welcome 10%", description: "Diskon 10% pertama", discount: 10, discountType: "PERCENTAGE", maxDiscount: 50000, maxUses: 100, usedCount: 0, active: true })
  await db.create("promos", { code: "TOPUP20", name: "Top Up 20%", description: "Diskon 20% minimal Rp50rb", discount: 20, discountType: "PERCENTAGE", minPurchase: 50000, maxDiscount: 100000, maxUses: 50, usedCount: 0, active: true })

  // Banners
  await db.create("banners", { title: "Top Up Game", subtitle: "Cepat & Aman", image: "", link: "/games", position: 0, active: true })
  await db.create("banners", { title: "Promo Spesial", subtitle: "Diskon hingga 20%", image: "", link: "/games", position: 1, active: true })

  // Settings
  await db.create("settings", { key: "site_name", value: "Shoping" })
  await db.create("settings", { key: "site_description", value: "Platform top up game terpercaya" })
  await db.create("settings", { key: "site_logo", value: "" })
  await db.create("settings", { key: "site_favicon", value: "" })
  await db.create("settings", { key: "primary_color", value: "#2563EB" })
  await db.create("settings", { key: "footer_text", value: "Shoping. All rights reserved." })
  await db.create("settings", { key: "contact_email", value: "support@shoping.com" })
  await db.create("settings", { key: "contact_whatsapp", value: "6281234567890" })
  await db.create("settings", { key: "contact_telegram", value: "@shoping" })
  await db.create("settings", { key: "meta_title", value: "Shoping - Top Up Game" })
  await db.create("settings", { key: "meta_description", value: "Top up game cepat dan aman" })

  console.log("✅ Database seeded!")
}

// Initialize seed on import
seedDatabase().catch(console.error)

export { db, DatabaseService, uuid }
