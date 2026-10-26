import { ethers } from "ethers";
import { adminAuth, adminDb } from "./firebase-admin.js";

/**
 * Generates a unique authentication challenge nonce.
 */
export function generateNonce() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `expendry_nonce_${timestamp}_${randomStr}`;
}

/**
 * Creates the standard EIP-191 message challenge to be signed by the user's wallet.
 */
export function createAuthChallenge(nonce) {
  return `Sign this message to authenticate with Expendry.\nNonce: ${nonce}\nChain: MST Testnet (91562037)`;
}

/**
 * Verifies that an EIP-191 signature corresponds to the claimed wallet address.
 */
export function verifyWalletSignature(address, message, signature) {
  if (!address || !message || !signature) {
    throw new Error("Missing address, message, or signature for verification");
  }

  let recoveredAddress;
  try {
    recoveredAddress = ethers.verifyMessage(message, signature);
  } catch (err) {
    throw new Error(`Signature verification failed: ${err.message}`);
  }

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error("Signature verification failed: Recovered address does not match claimed address");
  }

  return true;
}

/**
 * Maps an authenticated wallet to a Firebase custom token and creates/updates users/{uid} document.
 * Accepts optional dependency injection for testing.
 */
export async function signInWithWallet(address, signature, message, deps = {}) {
  const auth = deps.adminAuth || adminAuth;
  const db = deps.adminDb || adminDb;

  // 1. Verify EIP-191 signature
  verifyWalletSignature(address, message, signature);

  const normalizedAddress = address.toLowerCase();
  const uid = `wallet:${normalizedAddress}`;

  // 2. Generate Firebase custom token for client session
  const customToken = await auth.createCustomToken(uid, {
    walletAddress: normalizedAddress,
  });

  // 3. Upsert user document in Firestore: users/{uid}
  if (db && typeof db.collection === "function") {
    try {
      const userRef = db.collection("users").doc(uid);
      const doc = await userRef.get();
      const now = new Date().toISOString();

      if (!doc || !doc.exists) {
        await userRef.set({
          uid,
          walletAddress: normalizedAddress,
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          role: "machinist",
        });
      } else {
        await userRef.update({
          lastLogin: now,
          updatedAt: now,
        });
      }
    } catch (dbError) {
      console.warn("Firestore user profile upsert warning:", dbError.message);
    }
  }

  return {
    success: true,
    uid,
    walletAddress: normalizedAddress,
    customToken,
  };
}
