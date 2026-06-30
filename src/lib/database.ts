// ============================================================
// Database Service — Prisma/PostgreSQL
// ============================================================
// This service provides the same API as the previous JSON-based
// service, but uses Prisma ORM with PostgreSQL.
// All business logic remains unchanged — API routes import `db`
// and call the same methods: getAll, getById, create, update, etc.

import prisma from "./prisma"
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

function getPrismaModel(collection: CollectionName) {
  const models: Record<string, any> = {
    users: prisma.user,
    games: prisma.game,
    products: prisma.product,
    orders: prisma.order,
    providers: prisma.provider,
    payments: prisma.paymentMethod,
    banners: prisma.banner,
    promos: prisma.promo,
    settings: prisma.siteSetting,
    logs: prisma.auditLog,
    categories: prisma.category,
    sessions: prisma.session,
  }
  return models[collection]
}

function serializeDates(obj: any): any {
  if (!obj) return obj
  if (Array.isArray(obj)) return obj.map(serializeDates)
  if (typeof obj !== "object") return obj

  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      result[key] = value.toISOString()
    } else if (value instanceof Object && !Array.isArray(value) && !(value instanceof Date)) {
      result[key] = serializeDates(value)
    } else {
      result[key] = value
    }
  }
  return result
}

class DatabaseService {
  // ============================================================
  // READ operations
  // ============================================================

  async getAll<N extends CollectionName>(collection: N): Promise<CollectionType<N>[]> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findMany()
      return serializeDates(data) as CollectionType<N>[]
    } catch (error) {
      console.error(`Database error (getAll ${collection}):`, error)
      return []
    }
  }

  async getById<N extends CollectionName>(collection: N, id: string): Promise<CollectionType<N> | null> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findUnique({ where: { id } })
      return serializeDates(data) as CollectionType<N> | null
    } catch (error) {
      console.error(`Database error (getById ${collection}):`, error)
      return null
    }
  }

  async getBy<N extends CollectionName>(
    collection: N,
    field: string,
    value: unknown
  ): Promise<CollectionType<N>[]> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findMany({ where: { [field]: value } })
      return serializeDates(data) as CollectionType<N>[]
    } catch (error) {
      console.error(`Database error (getBy ${collection}):`, error)
      return []
    }
  }

  async findOne<N extends CollectionName>(
    collection: N,
    field: string,
    value: unknown
  ): Promise<CollectionType<N> | null> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findFirst({ where: { [field]: value } })
      return serializeDates(data) as CollectionType<N> | null
    } catch (error) {
      console.error(`Database error (findOne ${collection}):`, error)
      return null
    }
  }

  async findFirst<N extends CollectionName>(
    collection: N,
    query: Partial<CollectionType<N>>
  ): Promise<CollectionType<N> | null> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findFirst({ where: query as any })
      return serializeDates(data) as CollectionType<N> | null
    } catch (error) {
      console.error(`Database error (findFirst ${collection}):`, error)
      return null
    }
  }

  async findFirstOr<N extends CollectionName>(
    collection: N,
    conditions: Partial<CollectionType<N>>[]
  ): Promise<CollectionType<N> | null> {
    try {
      const model = getPrismaModel(collection)
      const data = await model.findFirst({
        where: { OR: conditions.map((cond) => cond as any) },
      })
      return serializeDates(data) as CollectionType<N> | null
    } catch (error) {
      console.error(`Database error (findFirstOr ${collection}):`, error)
      return null
    }
  }

  // ============================================================
  // WRITE operations
  // ============================================================

  async create<N extends CollectionName>(
    collection: N,
    data: Partial<CollectionType<N>>
  ): Promise<CollectionType<N>> {
    const createData = { ...data } as any
    if (createData.id === "") delete createData.id

    try {
      const model = getPrismaModel(collection)
      const result = await model.create({ data: createData })
      return serializeDates(result) as CollectionType<N>
    } catch (error) {
      console.error(`Database error (create ${collection}):`, error)
      throw error
    }
  }

  async update<N extends CollectionName>(
    collection: N,
    id: string,
    data: Partial<CollectionType<N>>
  ): Promise<CollectionType<N> | null> {
    try {
      const model = getPrismaModel(collection)
      const result = await model.update({ where: { id }, data })
      return serializeDates(result) as CollectionType<N>
    } catch (error) {
      console.error(`Database error (update ${collection}):`, error)
      return null
    }
  }

  async delete<N extends CollectionName>(
    collection: N,
    id: string
  ): Promise<boolean> {
    try {
      const model = getPrismaModel(collection)
      await model.delete({ where: { id } })
      return true
    } catch (error) {
      console.error(`Database error (delete ${collection}):`, error)
      return false
    }
  }

  async deleteMany<N extends CollectionName>(
    collection: N,
    query: Partial<CollectionType<N>>
  ): Promise<boolean> {
    try {
      const model = getPrismaModel(collection)
      await model.deleteMany({ where: query as any })
      return true
    } catch (error) {
      console.error(`Database error (deleteMany ${collection}):`, error)
      return false
    }
  }

  async count<N extends CollectionName>(
    collection: N,
    query?: Partial<CollectionType<N>>
  ): Promise<number> {
    try {
      const model = getPrismaModel(collection)
      if (query) return await model.count({ where: query as any })
      return await model.count()
    } catch (error) {
      console.error(`Database error (count ${collection}):`, error)
      return 0
    }
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
    try {
      const model = getPrismaModel(collection)
      const skip = (page - 1) * limit

      const [items, total] = await Promise.all([
        model.findMany({
          skip,
          take: limit,
          orderBy: { [sortField]: sortOrder },
        }),
        model.count(),
      ])

      return {
        data: serializeDates(items) as CollectionType<N>[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      console.error(`Database error (paginate ${collection}):`, error)
      return { data: [], total: 0, page, limit, totalPages: 0 }
    }
  }

  // ============================================================
  // Aggregation helpers
  // ============================================================

  async sum<N extends CollectionName>(
    collection: N,
    field: string,
    query?: Partial<CollectionType<N>>
  ): Promise<number> {
    try {
      const model = getPrismaModel(collection)
      const result = query
        ? await model.aggregate({ _sum: { [field]: true }, where: query as any })
        : await model.aggregate({ _sum: { [field]: true } })

      return (result._sum as any)?.[field] || 0
    } catch (error) {
      console.error(`Database error (sum ${collection}):`, error)
      return 0
    }
  }

  async clearCache(): Promise<void> {
    // No-op: Prisma handles its own connection pooling
  }
}

export const db = new DatabaseService()
export default db
