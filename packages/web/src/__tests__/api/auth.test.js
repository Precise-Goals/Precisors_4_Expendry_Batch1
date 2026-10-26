import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { ethers } from "ethers";
import { GET as nonceGet, POST as noncePost } from "../../app/api/auth/nonce/route.js";
import { POST as verifyPost } from "../../app/api/auth/verify/route.js";
import { activeNonces, setAuthDependencies } from "../../lib/auth.js";

describe("Auth API Routes Integration (/api/auth/nonce & /api/auth/verify)", () => {
  let testWallet;

  beforeEach(() => {
    testWallet = ethers.Wallet.createRandom();
    activeNonces.clear();

    setAuthDependencies({
      adminAuth: {
        createCustomToken: async (uid, claims) =>
          `mock_token_${uid}_${claims.walletAddress}`,
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

  describe("Nonce Generation Endpoint (/api/auth/nonce)", () => {
    it("GET generates unique nonce and EIP-191 formatted challenge message", async () => {
      const request = new Request("http://localhost:3000/api/auth/nonce");
      const response = await nonceGet(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.nonce).toMatch(/^expendry_nonce_\d+_[a-z0-9]+$/);
      expect(data.message).toContain(data.nonce);
      expect(data.message).toContain("MST Testnet (91562037)");
      expect(activeNonces.has(data.nonce)).toBe(true);
    });

    it("POST with address in body associates nonce with address", async () => {
      const request = new Request("http://localhost:3000/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: testWallet.address }),
      });

      const response = await noncePost(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(activeNonces.has(data.nonce)).toBe(true);
    });
  });

  describe("Wallet Verification Endpoint (/api/auth/verify)", () => {
    it("successfully verifies valid EIP-191 signature and issues custom token", async () => {
      // 1. Get nonce
      const nonceReq = new Request("http://localhost:3000/api/auth/nonce");
      const nonceRes = await nonceGet(nonceReq);
      const { nonce, message } = await nonceRes.json();

      // 2. Sign message with wallet
      const signature = await testWallet.signMessage(message);

      // 3. Post to verify
      const verifyReq = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          signature,
          message,
          nonce,
        }),
      });

      const verifyRes = await verifyPost(verifyReq);
      expect(verifyRes.status).toBe(200);

      const verifyData = await verifyRes.json();
      expect(verifyData.success).toBe(true);
      expect(verifyData.walletAddress).toBe(testWallet.address.toLowerCase());
      expect(verifyData.uid).toBe(`wallet:${testWallet.address.toLowerCase()}`);
      expect(verifyData.customToken).toContain("mock_token_wallet:");
    });

    it("returns 400 Bad Request when missing required fields", async () => {
      const req = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          // Missing signature and message
        }),
      });

      const res = await verifyPost(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Missing required parameters");
    });

    it("returns 401 Unauthorized for mismatched or tampered signature", async () => {
      // 1. Get nonce
      const nonceReq = new Request("http://localhost:3000/api/auth/nonce");
      const nonceRes = await nonceGet(nonceReq);
      const { nonce, message } = await nonceRes.json();

      // 2. Sign message with a different wallet
      const rogueWallet = ethers.Wallet.createRandom();
      const fraudulentSignature = await rogueWallet.signMessage(message);

      // 3. Claim to be testWallet with rogue signature
      const verifyReq = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          signature: fraudulentSignature,
          message,
          nonce,
        }),
      });

      const verifyRes = await verifyPost(verifyReq);
      expect(verifyRes.status).toBe(401);
      const data = await verifyRes.json();
      expect(data.error).toContain("Invalid wallet signature");
    });

    it("returns 401 Unauthorized on replay attempt of an already consumed nonce", async () => {
      // 1. Get nonce
      const nonceReq = new Request("http://localhost:3000/api/auth/nonce");
      const nonceRes = await nonceGet(nonceReq);
      const { nonce, message } = await nonceRes.json();

      const signature = await testWallet.signMessage(message);

      // 2. First verify succeeds
      const req1 = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          signature,
          message,
          nonce,
        }),
      });

      const res1 = await verifyPost(req1);
      expect(res1.status).toBe(200);

      // 3. Replay with the same nonce and signature
      const req2 = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          signature,
          message,
          nonce,
        }),
      });

      const res2 = await verifyPost(req2);
      expect(res2.status).toBe(401);
      const data2 = await res2.json();
      expect(data2.error).toContain("Invalid, expired, or replayed nonce");
    });

    it("returns 401 Unauthorized for unknown or forged nonce", async () => {
      const forgedNonce = "expendry_nonce_fake_12345";
      const message = `Sign this message...\nNonce: ${forgedNonce}`;
      const signature = await testWallet.signMessage(message);

      const req = new Request("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: testWallet.address,
          signature,
          message,
          nonce: forgedNonce,
        }),
      });

      const res = await verifyPost(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Invalid, expired, or replayed nonce");
    });
  });
});
