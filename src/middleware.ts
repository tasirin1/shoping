import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/games",
  "/games/",
  "/coming-soon",
  "/api/auth/login",
  "/api/auth/register",
  "/api/games",
  "/api/payment-methods",
  "/api/webhook",
  "/api/check-nickname",
  "/api/health",
  "/api/banners",
  "/api/promos",
  "/api/categories",
]

// Security headers
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Response with security headers
  const response = NextResponse.next()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  // CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs 'unsafe-inline' for dev, 'unsafe-eval' for SWC
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  response.headers.set("Content-Security-Policy", csp.join("; "))

  // Allow public paths
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return response
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return response
  }

  const sessionToken = request.cookies.get("session_token")?.value

  // Protected routes — require auth
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/api/payment") ||
    pathname.startsWith("/api/auth/me") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/users")
  ) {
    if (!sessionToken) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: response.headers })
      }
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes — require ADMIN role
  if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/admin")) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    const userRole = request.cookies.get("user_role")?.value
    if (userRole !== "ADMIN") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403, headers: response.headers })
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
