import { NextResponse } from "next/server";
import {
  validateAndConsumeNonce,
  extractNonceFromMessage,
  signInWithWallet,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      Object.prototype.hasOwnProperty.call(body, "__proto__") ||
      Object.prototype.hasOwnProperty.call(body, "constructor") ||
      Object.prototype.hasOwnProperty.call(body, "prototype")
    ) {
      return NextResponse.json(
        { error: "Invalid payload: Prototype pollution attempt detected" },
        { status: 400 }
      );
    }
    const { address, signature, message } = body;

    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required parameters: address, signature, and message are mandatory." },
        { status: 400 }
      );
    }

    const extractedNonce = extractNonceFromMessage(message);
    const providedNonce = body.nonce;

    // Strict nonce binding: body.nonce cannot conflict with nonce in signed challenge message
    if (providedNonce && extractedNonce && providedNonce !== extractedNonce) {
      return NextResponse.json(
        { error: "Authentication failed: Nonce mismatch between payload and challenge message." },
        { status: 401 }
      );
    }

    const nonceToValidate = extractedNonce || providedNonce;

    // 1. Nonce validation & replay protection
    if (!nonceToValidate || !validateAndConsumeNonce(nonceToValidate, address)) {
      return NextResponse.json(
        { error: "Authentication failed: Invalid, expired, or replayed nonce." },
        { status: 401 }
      );
    }

    // 2. Cryptographic signature verification and Firebase custom token issuance
    const result = await signInWithWallet(address, signature, message);

    return NextResponse.json(
      {
        success: true,
        uid: result.uid,
        walletAddress: result.walletAddress,
        customToken: result.customToken,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message?.includes("Signature verification failed")) {
      return NextResponse.json(
        { error: "Authentication failed: Invalid wallet signature." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server authentication error" },
      { status: 500 }
    );
  }
}
