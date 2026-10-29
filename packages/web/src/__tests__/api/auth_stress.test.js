import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ethers } from "ethers";
import { GET as nonceGet } from "../../app/api/auth/nonce/route.js";
import { POST as verifyPost } from "../../app/api/auth/verify/route.js";
import { activeNonces, setAuthDependencies } from "../../lib/auth.js";

describe("Auth Stress & Adversarial Security Suite (/api/auth/nonce & /api/auth/verify)", () => {
  let testWallet;

  beforeEach(() => {
    testWallet = ethers.Wallet.createRandom();
    activeNonces.clear();

    setAuthDependencies({
      adminAuth: {
        createCustomToken: async (uid, claims) =>
          `token_${uid}_${claims.walletAddress}`,
      },
      adminDb: {
        collection: () => ({
          doc: () => ({
            get: async () => ({ exists: false, data: () => null }),
            set: async () => {},
            update: async () => {},
          }),
        }),
      },
    });
  });

  afterEach(() => {
    setAuthDependencies(null);
  });

  it("handles 30 concurrent nonce requests generating strictly distinct cryptographically secure tokens", async () => {
    const requests = Array.from({ length: 30 }, () =>
      nonceGet(new Request("http://localhost:3000/api/auth/nonce"))
    );

    const responses = await Promise.all(requests);
    const nonces = new Set();

    for (const res of responses) {
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.nonce).toBeDefined();
      expect(nonces.has(data.nonce)).toBe(false);
      nonces.add(data.nonce);
    }

    expect(nonces.size).toBe(30);
  });

  it("blocks concurrent replay attacks where multiple requests submit the exact same signed nonce", async () => {
    const nonceRes = await nonceGet(new Request("http://localhost:3000/api/auth/nonce"));
    const { nonce, message } = await nonceRes.json();
    const signature = await testWallet.signMessage(message);

    const payload = JSON.stringify({
      address: testWallet.address,
      signature,
      message,
      nonce,
    });

    const [res1, res2] = await Promise.all([
      verifyPost(new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })),
      verifyPost(new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })),
    ]);

    const statuses = [res1.status, res2.status].sort();
    // One must succeed (200) and one must be rejected (401 replay)
    expect(statuses[0]).toBe(200);
    expect(statuses[1]).toBe(401);
  });

  it("strictly rejects expired nonces exceeding the 5-minute TTL window", async () => {
    const nonceRes = await nonceGet(new Request("http://localhost:3000/api/auth/nonce"));
    const { nonce, message } = await nonceRes.json();
    const signature = await testWallet.signMessage(message);

    // Manually age the nonce beyond 5 minutes
    const record = activeNonces.get(nonce);
    if (record) {
      record.createdAt = Date.now() - 360000; // 6 minutes ago
    }

    const res = await verifyPost(new Request("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: testWallet.address,
        signature,
        message,
        nonce,
      }),
    }));

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain("expired");
  });

  it("rejects mismatched nonce where body nonce differs from signed challenge message", async () => {
    const nonceRes1 = await nonceGet(new Request("http://localhost:3000/api/auth/nonce"));
    const { nonce: nonce1, message: message1 } = await nonceRes1.json();

    const nonceRes2 = await nonceGet(new Request("http://localhost:3000/api/auth/nonce"));
    const { nonce: nonce2 } = await nonceRes2.json();

    const signature = await testWallet.signMessage(message1);

    // Attacker sends signature for nonce1, but body specifies nonce2
    const res = await verifyPost(new Request("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: testWallet.address,
        signature,
        message: message1,
        nonce: nonce2,
      }),
    }));

    expect(res.status).toBe(401);
  });

  it("rejects non-object and array payloads defensively", async () => {
    const res = await verifyPost(new Request("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(["attack", "array"]),
    }));

    expect(res.status).toBe(400);
  });
});
