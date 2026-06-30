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
]

// Admin paths are protected within the route check

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get("session_token")?.value

  // Protected routes
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
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes - require ADMIN role
  if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/api/admin")) {
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Check role cookie for admin routes
    const userRole = request.cookies.get("user_role")?.value
    if (userRole !== "ADMIN") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
