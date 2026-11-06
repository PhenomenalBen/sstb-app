import { NextResponse } from "next/server"

export const MIN_PASSWORD_LENGTH = 8

/** Escape user-supplied text before inserting it into an HTML email. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Returns an error message if the password is unacceptable, otherwise null. */
export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (password.length > 200) {
    return "Password is too long."
  }
  return null
}

/**
 * Log the real error on the server, return a generic message to the client
 * so database / internal details are never exposed.
 */
export function serverError(context: string, err: unknown, message = "Something went wrong. Please try again.") {
  console.error(`${context}:`, err)
  return NextResponse.json({ error: message }, { status: 500 })
}

// ─── Rate limiting ───────────────────────────────────────────────────────────
// Simple fixed-window, in-memory limiter. It is per server instance, which is
// enough to stop casual abuse on a small deployment. For multi-instance
// hosting, swap this for a shared store (e.g. Upstash Redis).

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()

  // Opportunistic cleanup so the map does not grow forever.
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count++
  return true
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

export function tooManyRequests() {
  return NextResponse.json(
    { error: "Too many requests. Please wait a few minutes and try again." },
    { status: 429 }
  )
}

/** Convenience: rate limit a request by client IP. Returns a 429 response or null. */
export function limitByIp(req: Request, name: string, limit: number, windowMs: number) {
  return rateLimit(`${name}:${getClientIp(req)}`, limit, windowMs) ? null : tooManyRequests()
}
