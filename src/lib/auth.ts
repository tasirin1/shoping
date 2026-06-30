import { cookies } from "next/headers"
import { db } from "./database"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const SALT_ROUNDS = 12

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function generateSessionToken(): string {
  return crypto.randomBytes(64).toString("hex")
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  // Get user role for the cookie
  const user = await db.getById("users", userId)
  const role = user?.role || "USER"

  await db.create("sessions", { token, userId, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  })

  // Set role cookie for middleware to read
  cookieStore.set("user_role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) return null

  const session = await db.findOne("sessions", "token", token)
  if (!session || new Date(session.expiresAt) < new Date()) {
    if (session) await db.delete("sessions", session.id)
    return null
  }

  const user = await db.getById("users", session.userId)
  if (!user) return null

  return { ...session, user }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (token) {
    const session = await db.findOne("sessions", "token", token)
    if (session) await db.delete("sessions", session.id)
  }

  cookieStore.delete("session_token")
  cookieStore.delete("user_role")
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") throw new Error("Forbidden")
  return user
}
