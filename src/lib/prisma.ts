import { PrismaClient } from "@prisma/client"

let prismaInstance: PrismaClient | null = null

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is required but not set. Please configure PostgreSQL connection."
      )
    }
    prismaInstance = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
  }
  return prismaInstance
}

// Proxy defers PrismaClient creation until first property access (e.g. prisma.user)
export const prisma = new Proxy<PrismaClient>({} as PrismaClient, {
  get(_, prop: string | symbol) {
    // Handle special symbols (e.g. then for Promise detection)
    if (typeof prop === "symbol") {
      // If the symbol is for then/catch, PrismaClient isn't thenable - return undefined
      return undefined
    }
    return (getPrisma() as any)[prop]
  },
})

export default prisma
