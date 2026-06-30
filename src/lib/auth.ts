import { cookies } from "next/headers"
import { db } from "./database"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const SALT_ROUNDS = 12
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function hashPassword(password: string): Promise<string> {
  if (password.length < 6) throw new Error("Password minimal 6 karakter")
  if (password.length > 128) throw new Error("Password maksimal 128 karakter")
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function generateSessionToken(): string {
  return crypto.randomBytes(64).toString("hex")
}

function getClientIp(): string {
  // In production, this comes from headers set by the proxy/load balancer
  // For now, return a placeholder
  return "0.0.0.0"
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString()

  const user = await db.getById("users", userId)
  if (!user) throw new Error("User not found")
  const role = user.role || "USER"

  // Verify user is not suspended
  if (user.suspended) throw new Error("Akun telah dinonaktifkan")

  // Delete old sessions for this user (max 5 active sessions)
  const userSessions = await db.getBy("sessions", "userId", userId)
  if (userSessions.length >= 5) {
    // Delete oldest session
    const oldest = userSessions.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0]
    await db.delete("sessions", oldest.id)
  }

  await db.create("sessions", { token, userId, expiresAt })

  const cookieStore = await cookies()

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: new Date(expiresAt),
    path: "/",
  }

  cookieStore.set("session_token", token, cookieOptions)

  cookieStore.set("user_role", role, {
    ...cookieOptions,
    httpOnly: false, // Must be readable by middleware
  })

  // Log login
  try {
    await db.create("logs", {
      userId,
      action: "LOGIN",
      entity: "auth",
      entityId: userId,
      details: "Login berhasil",
      ip: getClientIp(),
    })
  } catch {
    // Silently fail logging
  }

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

  // Check if user is suspended
  if (user.suspended) {
    await db.delete("sessions", session.id)
    return null
  }

  // Rotate session token if more than 24 hours old
  const sessionAge = Date.now() - new Date(session.createdAt).getTime()
  if (sessionAge > 24 * 60 * 60 * 1000) {
    const newToken = generateSessionToken()
    const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString()

    await db.update("sessions", session.id, {
      token: newToken,
      expiresAt: newExpiresAt,
    })

    const cookieStore = await cookies()
    cookieStore.set("session_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(newExpiresAt),
      path: "/",
    })
    cookieStore.set("user_role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(newExpiresAt),
      path: "/",
    })

    return { ...session, token: newToken, expiresAt: newExpiresAt, user }
  }

  return { ...session, user }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  const userRole = cookieStore.get("user_role")?.value

  if (token) {
    const session = await db.findOne("sessions", "token", token)
    if (session) {
      // Log logout
      try {
        await db.create("logs", {
          userId: session.userId,
          action: "LOGOUT",
          entity: "auth",
          entityId: session.userId,
          details: "Logout berhasil",
          ip: getClientIp(),
        })
      } catch {
        // Silently fail
      }
      await db.delete("sessions", session.id)
    }
  }

  // Clear all session cookies
  cookieStore.set("session_token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 })
  cookieStore.set("user_role", "", { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 })
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
