import { describe, it, expect } from "bun:test";
import { middleware, config } from "../middleware.js";

describe("Next.js Security Middleware", () => {
  it("sets Content-Security-Policy with required directives", () => {
    const request = new Request("http://localhost:3000/community");
    const response = middleware(request);

    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("https://testnetrpc.mstblockchain.com");
    expect(csp).toContain("https://api.sarvam.ai");
    expect(csp).toContain("https://*.firebaseio.com");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("sets X-Frame-Options to DENY and Referrer-Policy to strict-origin-when-cross-origin", () => {
    const request = new Request("http://localhost:3000/marketplace");
    const response = middleware(request);

    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("exports a matcher configuration excluding static bundles", () => {
    expect(config).toBeDefined();
    expect(config.matcher).toBeInstanceOf(Array);
    expect(config.matcher.length).toBeGreaterThan(0);
  });
});
