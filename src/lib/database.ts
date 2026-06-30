// ============================================================
// Database Service - JSON File Based
// ============================================================
// This service provides CRUD operations using JSON files as storage.
// It is designed to be easily replaceable with Prisma/PostgreSQL
// in production without changing business logic.

import fs from "fs"
import path from "path"
import crypto from "crypto"
import type {
  User, Game, Product, Category, Provider, Order,
  PaymentMethod, Promo, Banner, SiteSetting, AuditLog, Session,
} from "@/types"

type CollectionName =
  | "users" | "games" | "products" | "orders" | "providers"
  | "payments" | "banners" | "promos" | "settings" | "logs"
  | "categories" | "sessions"

type CollectionMap = {
  users: User
  games: Game
  products: Product
  orders: Order
  providers: Provider
  payments: PaymentMethod
  banners: Banner
  promos: Promo
  settings: SiteSetting
  logs: AuditLog
  categories: Category
  sessions: Session
}

type CollectionType<N extends CollectionName> = CollectionMap[N]

const DB_DIR = path.join(process.cwd(), "database")
const BACKUP_DIR = path.join(DB_DIR, "backups")

// In-memory cache for faster reads
const cache = new Map<string, any[]>()
const cacheTimestamps = new Map<string, number>()
const CACHE_TTL = 2000

// File locks to prevent race conditions
const writeLocks = new Map<string, Promise<void>>()

function getFilePath(collection: CollectionName): string {
  const fileMap: Record<CollectionName, string> = {
    users: "users.json",
    games: "games.json",
    products: "products.json",
    orders: "orders.json",
    providers: "providers.json",
    payments: "payments.json",
    banners: "banners.json",
    promos: "promos.json",
    settings: "settings.json",
    logs: "logs.json",
    categories: "categories.json",
    sessions: "sessions.json",
  }
  return path.join(DB_DIR, fileMap[collection])
}

function generateId(): string {
  return crypto.randomUUID()
}

function ensureDbDir(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

function ensureFile(collection: CollectionName): void {
  ensureDbDir()
  const filePath = getFilePath(collection)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8")
  }
}

function readFileSync(collection: CollectionName): any[] {
  const filePath = getFilePath(collection)
  ensureFile(collection)
  try {
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeFileSync(collection: CollectionName, data: any[]): void {
  const filePath = getFilePath(collection)
  ensureDbDir()
  createBackup(collection, data)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
  cache.set(collection, data)
  cacheTimestamps.set(collection, Date.now())
}

function createBackup(collection: CollectionName, data: any[]): void {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(BACKUP_DIR, `${collection}_${timestamp}.json`)
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), "utf-8")
    const backupPrefix = `${collection}_`
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith(backupPrefix))
      .sort()
      .reverse()
    if (backups.length > 5) {
      for (const old of backups.slice(5)) {
        fs.unlinkSync(path.join(BACKUP_DIR, old))
      }
    }
  } catch {
    // Silently fail backup
  }
}

function getCached<T>(collection: string): T[] | null {
  const cached = cache.get(collection)
  const timestamp = cacheTimestamps.get(collection)
  if (cached && timestamp && Date.now() - timestamp < CACHE_TTL) {
    return cached as T[]
  }
  return null
}

async function withLock<T>(collection: string, fn: () => Promise<T>): Promise<T> {
  let currentLock = writeLocks.get(collection) || Promise.resolve()
  const newLock = currentLock.then(async () => fn()).finally(() => {
    if (writeLocks.get(collection) === newLock) {
      writeLocks.delete(collection)
    }
  })
  writeLocks.set(collection, newLock)
  return newLock
}

class DatabaseService {
  // ============================================================
  // READ operations
  // ============================================================

  async getAll<N extends CollectionName>(collection: N): Promise<CollectionType<N>[]> {
    const cached = getCached<CollectionType<N>>(collection)
    if (cached) return cached
    const data = readFileSync(collection) as CollectionType<N>[]
    cache.set(collection, data)
    cacheTimestamps.set(collection, Date.now())
    return data
  }

  async getById<N extends CollectionName>(collection: N, id: string): Promise<CollectionType<N> | null> {
    const data = await this.getAll(collection)
    return data.find(item => (item as any).id === id) || null
  }

  async getBy<N extends CollectionName>(
    collection: N,
    field: string,
    value: unknown
  ): Promise<CollectionType<N>[]> {
    const data = await this.getAll(collection)
    return data.filter(item => (item as any)[field] === value)
  }

  async findOne<N extends CollectionName>(
    collection: N,
    field: string,
    value: unknown
  ): Promise<CollectionType<N> | null> {
    const data = await this.getAll(collection)
    return data.find(item => (item as any)[field] === value) || null
  }

  async findFirst<N extends CollectionName>(
    collection: N,
    query: Partial<CollectionType<N>>
  ): Promise<CollectionType<N> | null> {
    const data = await this.getAll(collection)
    return data.find(item => {
      for (const [key, value] of Object.entries(query)) {
        if ((item as any)[key] !== value) return false
      }
      return true
    }) || null
  }

  async findFirstOr<N extends CollectionName>(
    collection: N,
    conditions: Partial<CollectionType<N>>[]
  ): Promise<CollectionType<N> | null> {
    const data = await this.getAll(collection)
    return data.find(item => {
      for (const condition of conditions) {
        let matches = true
        for (const [key, value] of Object.entries(condition)) {
          if ((item as any)[key] !== value) { matches = false; break }
        }
        if (matches) return true
      }
      return false
    }) || null
  }

  // ============================================================
  // WRITE operations
  // ============================================================

  async create<N extends CollectionName>(
    collection: N,
    data: Partial<CollectionType<N>>
  ): Promise<CollectionType<N>> {
    return withLock(collection, async () => {
      const items = readFileSync(collection) as any[]
      const newItem = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      items.push(newItem)
      writeFileSync(collection, items)
      return newItem as CollectionType<N>
    })
  }

  async update<N extends CollectionName>(
    collection: N,
    id: string,
    data: Partial<CollectionType<N>>
  ): Promise<CollectionType<N> | null> {
    return withLock(collection, async () => {
      const items = readFileSync(collection) as any[]
      const index = items.findIndex(item => item.id === id)
      if (index === -1) return null
      items[index] = {
        ...items[index],
        ...data,
        id: items[index].id,
        createdAt: items[index].createdAt,
        updatedAt: new Date().toISOString(),
      }
      writeFileSync(collection, items)
      return items[index] as CollectionType<N>
    })
  }

  async delete<N extends CollectionName>(collection: N, id: string): Promise<boolean> {
    return withLock(collection, async () => {
      const items = readFileSync(collection) as any[]
      const index = items.findIndex(item => item.id === id)
      if (index === -1) return false
      items.splice(index, 1)
      writeFileSync(collection, items)
      return true
    })
  }

  async deleteMany<N extends CollectionName>(
    collection: N,
    query: Partial<CollectionType<N>>
  ): Promise<boolean> {
    return withLock(collection, async () => {
      let items = readFileSync(collection) as any[]
      const filtered = items.filter(item => {
        for (const [key, value] of Object.entries(query)) {
          if ((item as any)[key] === value) return false
        }
        return true
      })
      if (filtered.length === items.length) return false
      writeFileSync(collection, filtered)
      return true
    })
  }

  async count<N extends CollectionName>(collection: N, query?: Partial<CollectionType<N>>): Promise<number> {
    const data = await this.getAll(collection)
    if (!query) return data.length
    return data.filter(item => {
      for (const [key, value] of Object.entries(query)) {
        if ((item as any)[key] !== value) return false
      }
      return true
    }).length
  }

  async paginate<N extends CollectionName>(
    collection: N,
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{
    data: CollectionType<N>[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    let data = await this.getAll(collection)
    data.sort((a: any, b: any) => {
      const aVal = a[sortField] || ""
      const bVal = b[sortField] || ""
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
    const total = data.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit
    const paged = data.slice(skip, skip + limit)
    return { data: paged as CollectionType<N>[], total, page, limit, totalPages }
  }

  async sum<N extends CollectionName>(
    collection: N,
    field: string,
    query?: Partial<CollectionType<N>>
  ): Promise<number> {
    const data = await this.getAll(collection)
    let filtered = data
    if (query) {
      filtered = data.filter(item => {
        for (const [key, value] of Object.entries(query)) {
          if ((item as any)[key] !== value) return false
        }
        return true
      })
    }
    return filtered.reduce((sum, item) => sum + (Number((item as any)[field]) || 0), 0)
  }

  async clearCache(): Promise<void> {
    cache.clear()
    cacheTimestamps.clear()
  }
}

export const db = new DatabaseService()
export default db
