import { NextResponse } from "next/server";

/**
 * Token bucket in-memory rate limiter.
 * Supports configurable capacity and refill rate per key (e.g., client IP).
 */
export class TokenBucketRateLimiter {
  constructor({ capacity = 20, windowMs = 60 * 1000 } = {}) {
    this.capacity = capacity;
    this.windowMs = windowMs;
    this.fillRate = capacity / windowMs; // tokens per millisecond
    this.buckets = new Map();
  }

  check(key) {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity - 1,
        lastRefill: now,
      };
      this.buckets.set(key, bucket);
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retryAfter: 0,
      };
    }

    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsed * this.fillRate);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retryAfter: 0,
      };
    }

    // Not enough tokens
    const missing = 1 - bucket.tokens;
    const retryAfter = Math.max(1, Math.ceil(missing / this.fillRate / 1000));

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  clear() {
    this.buckets.clear();
  }
}

// Global rate limiter instances
export const postsRateLimiter = new TokenBucketRateLimiter({
  capacity: 10,
  windowMs: 60 * 1000,
});

export const agentRateLimiter = new TokenBucketRateLimiter({
  capacity: 20,
  windowMs: 60 * 1000,
});

/**
 * Extracts client IP from standard request headers.
 */
export function getClientIp(request) {
  if (!request || !request.headers) return "127.0.0.1";
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Applies token-bucket rate limiting to an incoming Next.js API request.
 * Returns null if allowed, or a NextResponse 429 with Retry-After header if exceeded.
 */
export function applyRateLimit(request, limiter) {
  const ip = getClientIp(request);
  const result = limiter.check(ip);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Too many requests, please try again later.",
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfter),
          "X-RateLimit-Limit": String(limiter.capacity),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}

export function clearRateLimits() {
  postsRateLimiter.clear();
  agentRateLimiter.clear();
}
