import { describe, it, expect, beforeEach } from "bun:test";
import {
  TokenBucketRateLimiter,
  postsRateLimiter,
  agentRateLimiter,
  applyRateLimit,
  clearRateLimits,
} from "../../lib/rateLimit";

describe("TokenBucketRateLimiter Unit Tests", () => {
  beforeEach(() => {
    clearRateLimits();
  });

  it("allows requests up to capacity and blocks subsequent requests with 429", () => {
    const limiter = new TokenBucketRateLimiter({ capacity: 5, windowMs: 60000 });
    const ip = "192.168.1.1";

    for (let i = 0; i < 5; i++) {
      const res = limiter.check(ip);
      expect(res.allowed).toBe(true);
    }

    const blocked = limiter.check(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("isolates rate limits by client IP key", () => {
    const limiter = new TokenBucketRateLimiter({ capacity: 2, windowMs: 60000 });
    expect(limiter.check("ip-1").allowed).toBe(true);
    expect(limiter.check("ip-1").allowed).toBe(true);
    expect(limiter.check("ip-1").allowed).toBe(false);

    // ip-2 should still have its full capacity
    expect(limiter.check("ip-2").allowed).toBe(true);
    expect(limiter.check("ip-2").allowed).toBe(true);
  });

  it("applyRateLimit returns 429 response with Retry-After header when limit exceeded", () => {
    const limiter = new TokenBucketRateLimiter({ capacity: 1, windowMs: 60000 });
    const fakeReq = {
      headers: new Headers({ "x-forwarded-for": "10.10.10.10" }),
    };

    const first = applyRateLimit(fakeReq, limiter);
    expect(first).toBeNull(); // Allowed

    const second = applyRateLimit(fakeReq, limiter);
    expect(second).not.toBeNull();
    expect(second.status).toBe(429);
    expect(second.headers.get("Retry-After")).toBeDefined();
    expect(second.headers.get("X-RateLimit-Limit")).toBe("1");
  });
});
