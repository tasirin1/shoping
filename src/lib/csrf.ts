// ============================================================
// CSRF Protection
// ============================================================
// Uses Double Submit Cookie pattern.
// Since our API routes use SameSite=Lax cookies and JSON body,
// CSRF risk is minimal for modern browsers. However, we implement
// token-based protection for state-changing operations.

import crypto from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const CSRF_COOKIE = "csrf_token"
const CSRF_HEADER = "x-csrf-token"

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_COOKIE)?.value
  if (!token) {
    token = generateToken()
    cookieStore.set(CSRF_COOKIE, token, {
      httpOnly: false, // Must be readable by JS for the header
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    })
  }
  return token
}

export async function validateCsrf(request: Request): Promise<boolean> {
  // Skip CSRF check for GET/HEAD requests
  if (request.method === "GET" || request.method === "HEAD") return true

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)

  if (!cookieToken || !headerToken) return false
  return crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
}

export function csrfErrorResponse() {
  return NextResponse.json(
    { success: false, error: "CSRF token tidak valid. Refresh halaman dan coba lagi." },
    { status: 403 }
  )
}
