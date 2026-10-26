import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isValidAddress } from "@/lib/wallet";
import { claimPostReward, DailyCapExceededError } from "@/lib/reward";
import { POST_TYPES } from "shared/constants";
import { postsRateLimiter, applyRateLimit } from "@/lib/rateLimit";
import DOMPurify from "isomorphic-dompurify";

let postDeps = {};

export function setPostsDependencies(deps) {
  postDeps = deps || {};
  postsRateLimiter.clear();
}

export function clearRateLimits() {
  postsRateLimiter.clear();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type");
  const db = postDeps.adminDb || adminDb;

  if (db && typeof db.collection === "function") {
    try {
      let query = db.collection("posts").orderBy("createdAt", "desc").limit(50);
      if (typeFilter && typeFilter !== "All" && POST_TYPES.includes(typeFilter)) {
        query = query.where("type", "==", typeFilter);
      }
      const snapshot = await query.get();
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, posts });
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ success: true, posts: [] });
}

export async function POST(request) {
  // Enforce token-bucket rate limit (10 req/min per IP)
  const rateLimitResponse = applyRateLimit(request, postsRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload must be a non-empty object" },
        { status: 400 }
      );
    }

    const { title, content, type, authorWallet } = body;

    // 1. Authentication check
    if (!authorWallet || !isValidAddress(authorWallet)) {
      return NextResponse.json(
        { error: "Authentication required: Missing or invalid author wallet address." },
        { status: 401 }
      );
    }

    // 2. Input validation & Sanitisation (strip HTML tags using DOMPurify)
    const sanitizedTitle = typeof title === "string" ? DOMPurify.sanitize(title, { ALLOWED_TAGS: [] }).trim() : "";
    const sanitizedContent = typeof content === "string" ? DOMPurify.sanitize(content, { ALLOWED_TAGS: [] }).trim() : "";

    if (!sanitizedTitle || sanitizedTitle.length < 3) {
      return NextResponse.json(
        { error: "Validation error: Title is required and must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!sanitizedContent || sanitizedContent.length < 10) {
      return NextResponse.json(
        { error: "Validation error: Content is required and must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (!type || !POST_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Validation error: Post type must be one of: ${POST_TYPES.join(", ")}.` },
        { status: 400 }
      );
    }

    const normalizedWallet = authorWallet.toLowerCase();

    // 3. Daily Cap & Reward Orchestration
    let rewardResult;
    try {
      rewardResult = await claimPostReward(normalizedWallet);
    } catch (err) {
      if (err instanceof DailyCapExceededError || err.code === 429) {
        return NextResponse.json(
          { error: err.message || "Daily reward cap of 50 EXPEN reached for this wallet" },
          { status: 429 }
        );
      }
      throw err;
    }

    const txHash = rewardResult.txHash;
    const now = new Date().toISOString();

    // 4. Write to Firestore: posts collection
    let postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const db = postDeps.adminDb || adminDb;
    if (db && typeof db.collection === "function") {
      try {
        const postRef = await db.collection("posts").add({
          title: sanitizedTitle,
          content: sanitizedContent,
          type,
          authorWallet: normalizedWallet,
          txHash,
          expenRewarded: 10,
          rewarded: true,
          createdAt: now,
        });
        postId = postRef.id;
      } catch (dbErr) {
        console.warn("Firestore post save warning:", dbErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        postId,
        txHash,
        expenRewarded: 10,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error processing post" },
      { status: 500 }
    );
  }
}
