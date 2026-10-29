import crypto from 'crypto';
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ethers } from "ethers";
import { POST as postRoute, setPostsDependencies, clearRateLimits } from "../../app/api/posts/route.js";
import { setRewardDependencies, dailyTallies } from "../../lib/reward.js";

describe("Posts API Stress & Boundary Verification (/api/posts)", () => {
  let createdDocs = [];

  beforeEach(() => {
    clearRateLimits();
    dailyTallies.clear();
    createdDocs = [];

    const mockDb = {
      collection: (colName) => ({
        add: async (data) => {
          const doc = { id: `doc_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`, ...data };
          createdDocs.push(doc);
          return doc;
        },
        doc: () => ({
          update: async () => {},
          set: async () => {},
          get: async () => ({ exists: false, data: () => null }),
        }),
      }),
    };

    const mockContract = {
      mint: async () => ({ hash: "0x" + "f".repeat(64) }),
    };

    setRewardDependencies({
      adminDb: mockDb,
      contract: mockContract,
    });

    setPostsDependencies({
      adminDb: mockDb,
    });
  });

  afterEach(() => {
    setRewardDependencies(null);
    setPostsDependencies(null);
  });

  it("enforces strict token-bucket rate limit rejecting the 11th request within 1 minute", async () => {
    const makeReq = () => {
      // Use unique wallet for each request so wallet daily cap does not interfere with IP rate limit
      const wallet = ethers.Wallet.createRandom().address.toLowerCase();
      return postRoute(
        new Request("http://localhost:3000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "198.51.100.24",
          },
          body: JSON.stringify({
            title: "Rate Limit Stress Test Setup",
            content: "Detailed setup notes for testing the rate limiter bucket boundaries.",
            type: "Setup Tip",
            authorWallet: wallet,
          }),
        })
      );
    };

    // First 10 requests must succeed (201)
    for (let i = 0; i < 10; i++) {
      const res = await makeReq();
      expect(res.status).toBe(201);
    }

    // 11th request must be rate limited (429)
    const blockedRes = await makeReq();
    expect(blockedRes.status).toBe(429);
    const data = await blockedRes.json();
    expect(data.error).toContain("Rate limit exceeded");
  });

  it("isolates rate limit token buckets across distinct IP addresses", async () => {
    // Saturate IP-A (10 requests)
    for (let i = 0; i < 10; i++) {
      const wallet = ethers.Wallet.createRandom().address.toLowerCase();
      const res = await postRoute(
        new Request("http://localhost:3000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "203.0.113.10",
          },
          body: JSON.stringify({
            title: "Multi-tenant IP Isolation Test",
            content: "Testing that independent IP addresses have isolated token buckets.",
            type: "Experience",
            authorWallet: wallet,
          }),
        })
      );
      expect(res.status).toBe(201);
    }

    // IP-A 11th is blocked
    const walletA = ethers.Wallet.createRandom().address.toLowerCase();
    const blockedA = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "203.0.113.10",
        },
        body: JSON.stringify({
          title: "Multi-tenant IP Isolation Test",
          content: "Testing that independent IP addresses have isolated token buckets.",
          type: "Experience",
          authorWallet: walletA,
        }),
      })
    );
    expect(blockedA.status).toBe(429);

    // IP-B is still permitted
    const walletB = ethers.Wallet.createRandom().address.toLowerCase();
    const permittedB = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "203.0.113.20",
        },
        body: JSON.stringify({
          title: "Multi-tenant IP Isolation Test",
          content: "Testing that independent IP addresses have isolated token buckets.",
          type: "Experience",
          authorWallet: walletB,
        }),
      })
    );
    expect(permittedB.status).toBe(201);
  });

  it("thoroughly neutralizes polyglot and SVG/img XSS injection vectors", async () => {
    const maliciousPayload = {
      title: "Safe Title with <script>alert('xss')</script> Injection",
      content: "Machining note safe text <img src=x onerror=alert('hack') /> <svg onload=alert(1)>nested</svg>",
      type: "Blueprint",
      authorWallet: ethers.Wallet.createRandom().address.toLowerCase(),
    };

    const res = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(maliciousPayload),
      })
    );

    expect(res.status).toBe(201);
    const stored = createdDocs[0];
    expect(stored.title).not.toContain("<script>");
    expect(stored.title).not.toContain("</script>");
    expect(stored.content).not.toContain("<img");
    expect(stored.content).not.toContain("<svg");
    expect(stored.content).not.toContain("onerror");
    expect(stored.content).not.toContain("onload");
    expect(stored.content).toContain("Machining note safe text");
  });

  it("enforces title length boundaries (min 3 chars, max 200 chars)", async () => {
    const wallet = ethers.Wallet.createRandom().address.toLowerCase();

    // 2 chars -> fail
    const shortRes = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "AB",
          content: "Valid description body for machining test.",
          type: "Idea",
          authorWallet: wallet,
        }),
      })
    );
    expect(shortRes.status).toBe(400);

    // 201 chars -> fail
    const longRes = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "X".repeat(201),
          content: "Valid description body for machining test.",
          type: "Idea",
          authorWallet: wallet,
        }),
      })
    );
    expect(longRes.status).toBe(400);
  });

  it("enforces content length boundaries (min 10 chars, max 10000 chars)", async () => {
    const wallet = ethers.Wallet.createRandom().address.toLowerCase();

    // 9 chars -> fail
    const shortRes = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Valid Title Here",
          content: "123456789",
          type: "Video Note",
          authorWallet: wallet,
        }),
      })
    );
    expect(shortRes.status).toBe(400);

    // 10001 chars -> fail
    const longRes = await postRoute(
      new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Valid Title Here",
          content: "A".repeat(10001),
          type: "Video Note",
          authorWallet: wallet,
        }),
      })
    );
    expect(longRes.status).toBe(400);
  });
});
