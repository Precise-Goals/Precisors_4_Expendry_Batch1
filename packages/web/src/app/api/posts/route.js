import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isValidAddress } from "@/lib/wallet";
import { claimPostReward, DailyCapExceededError } from "@/lib/reward";
import { POST_TYPES } from "shared/constants";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get("type");

  if (adminDb && typeof adminDb.collection === "function") {
    try {
      let query = adminDb.collection("posts").orderBy("createdAt", "desc").limit(50);
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

    // 2. Input validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Validation error: Title is required and must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length < 10) {
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

    if (adminDb && typeof adminDb.collection === "function") {
      try {
        const postRef = await adminDb.collection("posts").add({
          title: title.trim(),
          content: content.trim(),
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
