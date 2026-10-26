import { describe, it, expect, beforeEach } from "bun:test";
import { ethers } from "ethers";
import {
  generateNonce,
  createAuthChallenge,
  verifyWalletSignature,
  signInWithWallet,
} from "../../lib/auth.js";

describe("Wallet Authentication & Firebase UID Mapping", () => {
  let wallet;
  let mockAuth;
  let mockDb;
  let storedUsers;

  beforeEach(() => {
    wallet = ethers.Wallet.createRandom();
    storedUsers = new Map();

    mockAuth = {
      createCustomToken: async (uid, claims) => {
        return `mock_token_${uid}_${claims.walletAddress}`;
      },
    };

    mockDb = {
      collection: (colName) => {
        return {
          doc: (docId) => {
            return {
              get: async () => {
                if (storedUsers.has(docId)) {
                  return { exists: true, data: () => storedUsers.get(docId) };
                }
                return { exists: false, data: () => null };
              },
              set: async (data) => {
                storedUsers.set(docId, data);
              },
              update: async (data) => {
                const existing = storedUsers.get(docId) || {};
                storedUsers.set(docId, { ...existing, ...data });
              },
            };
          },
        };
      },
    };
  });

  describe("Nonce & Challenge Generation", () => {
    it("should generate a unique nonce with expendry prefix", () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      expect(nonce1).toStartWith("expendry_nonce_");
      expect(nonce2).toStartWith("expendry_nonce_");
      expect(nonce1).not.toBe(nonce2);
    });

    it("should format challenge with nonce and chain information", () => {
      const nonce = generateNonce();
      const challenge = createAuthChallenge(nonce);
      expect(challenge).toContain(nonce);
      expect(challenge).toContain("MST Testnet (91562037)");
    });
  });

  describe("Signature Verification", () => {
    it("should verify valid signature produced by wallet", async () => {
      const message = "Sign this message to test authentication";
      const signature = await wallet.signMessage(message);
      const isValid = verifyWalletSignature(wallet.address, message, signature);
      expect(isValid).toBe(true);
    });

    it("should reject signature if address does not match", async () => {
      const otherWallet = ethers.Wallet.createRandom();
      const message = "Sign this message to test authentication";
      const signature = await wallet.signMessage(message);

      expect(() => {
        verifyWalletSignature(otherWallet.address, message, signature);
      }).toThrow("Recovered address does not match claimed address");
    });

    it("should throw error when missing parameters", () => {
      expect(() => {
        verifyWalletSignature("", "msg", "sig");
      }).toThrow("Missing address, message, or signature");
    });
  });

  describe("signInWithWallet Orchestration", () => {
    it("should create custom token and write new user doc in Firestore", async () => {
      const nonce = generateNonce();
      const message = createAuthChallenge(nonce);
      const signature = await wallet.signMessage(message);

      const result = await signInWithWallet(wallet.address, signature, message, {
        adminAuth: mockAuth,
        adminDb: mockDb,
      });

      expect(result.success).toBe(true);
      expect(result.walletAddress).toBe(wallet.address.toLowerCase());
      expect(result.uid).toBe(`wallet:${wallet.address.toLowerCase()}`);
      expect(result.customToken).toContain(result.uid);

      // Verify user document was written to mock Firestore
      const userDoc = storedUsers.get(result.uid);
      expect(userDoc).toBeDefined();
      expect(userDoc.walletAddress).toBe(wallet.address.toLowerCase());
      expect(userDoc.role).toBe("machinist");
    });

    it("should update existing user document on repeat sign-in", async () => {
      const nonce1 = generateNonce();
      const message1 = createAuthChallenge(nonce1);
      const signature1 = await wallet.signMessage(message1);

      // First sign-in
      await signInWithWallet(wallet.address, signature1, message1, {
        adminAuth: mockAuth,
        adminDb: mockDb,
      });

      const initialDoc = storedUsers.get(`wallet:${wallet.address.toLowerCase()}`);
      expect(initialDoc).toBeDefined();

      // Second sign-in with new nonce
      const nonce2 = generateNonce();
      const message2 = createAuthChallenge(nonce2);
      const signature2 = await wallet.signMessage(message2);

      const result2 = await signInWithWallet(wallet.address, signature2, message2, {
        adminAuth: mockAuth,
        adminDb: mockDb,
      });

      expect(result2.success).toBe(true);
      const updatedDoc = storedUsers.get(`wallet:${wallet.address.toLowerCase()}`);
      expect(updatedDoc.lastLogin).toBeDefined();
      expect(updatedDoc.createdAt).toBe(initialDoc.createdAt);
    });
  });
});
