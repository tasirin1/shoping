// ============================================================
// Rate Limiter — In-memory sliding window
// ============================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000)

export interface RateLimitConfig {
  max: number       // Max requests
  windowMs: number  // Time window in ms
}

const DEFAULTS = {
  strict: { max: 5, windowMs: 60_000 },     // 5 req/min (login, register)
  moderate: { max: 30, windowMs: 60_000 },   // 30 req/min (upload, checkout)
  loose: { max: 100, windowMs: 60_000 },     // 100 req/min (general API)
}

export type RateLimitTier = keyof typeof DEFAULTS

export function getRateLimitConfig(tier: RateLimitTier): RateLimitConfig {
  return DEFAULTS[tier]
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULTS.strict
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  // No existing entry or window expired — reset
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs }
  }

  // Within window — increment
  entry.count++
  if (entry.count > config.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt }
}

export function rateLimitKey(identifier: string, action: string): string {
  return `${action}:${identifier}`
}

// Express.js-style middleware helper for API routes
export function rateLimitResponse(identifier: string, tier: RateLimitTier = "strict") {
  const config = getRateLimitConfig(tier)
  const result = checkRateLimit(identifier, config)
  return {
    headers: {
      "X-RateLimit-Limit": String(config.max),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    },
    allowed: result.allowed,
  }
}
