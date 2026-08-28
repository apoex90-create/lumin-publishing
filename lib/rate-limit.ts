interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Bound memory growth on long-running server instances by periodically
// sweeping expired buckets instead of letting the map grow forever.
function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

/**
 * In-memory fixed-window rate limiter keyed by a caller-supplied string
 * (e.g. IP address). Good enough for a single server instance; swap for a
 * shared store (Upstash/Redis) before scaling to multiple instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (buckets.size > 10000) cleanup(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count++;
  return { ok: true, retryAfterSeconds: 0 };
}

export function getClientIp(req: Request & { ip?: string }): string {
  // On Vercel, req.ip is set by the edge network and cannot be spoofed by callers.
  // Fall back to x-forwarded-for only in dev (Vercel always sets req.ip in production).
  if ((req as any).ip) return (req as any).ip as string;
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
