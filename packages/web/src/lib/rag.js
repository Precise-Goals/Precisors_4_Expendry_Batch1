/**
 * RAG Engine — Community Post Chunker & Normalizer
 * 
 * Extracts tacit shop-floor knowledge from Firestore posts,
 * strips markdown, segments by sentence boundaries (<=400 tokens),
 * and weights by post type (e.g. Blueprint = 1.5x) and recency.
 */

import { adminDb } from "./firebase-admin";

export const POST_TYPE_WEIGHTS = {
  Blueprint: 1.5,
  "Setup Tip": 1.3,
  Experience: 1.0,
  Idea: 1.0,
  "Video Note": 1.0,
};

/**
 * Strips markdown formatting to produce clean plaintext.
 */
export function stripMarkdown(text) {
  if (!text || typeof text !== "string") return "";

  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Remove headers # Header
    .replace(/^#{1,6}\s+/gm, "")
    // Remove blockquotes > quote
    .replace(/^>\s+/gm, "")
    // Remove emphasis **bold**, *italic*, __bold__, _italic_
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Normalize whitespace
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/**
 * Approximates token count (~3.5 characters per token in English, higher byte density in Devanagari).
 */
export function estimateTokens(text) {
  if (!text || typeof text !== "string") return 0;
  return Math.ceil(text.length / 3.5);
}

/**
 * Chunks text by sentence boundary (respecting punctuation including Devanagari danda ।).
 */
export function chunkText(text, maxChunkTokens = 400) {
  if (!text || typeof text !== "string") return [];

  const clean = stripMarkdown(text);
  if (!clean) return [];

  // Split on sentence boundaries (. ! ? । followed by whitespace)
  const sentences = clean.split(/(?<=[.?!।])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (estimateTokens(candidate) > maxChunkTokens && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Computes recency decay multiplier (1.0 for brand new, decaying smoothly to min 0.5 over 60 days).
 */
export function calculateRecencyScore(createdAt) {
  if (!createdAt) return 1.0;
  const now = Date.now();
  const createdMs = typeof createdAt === "number" ? createdAt : (createdAt.toMillis ? createdAt.toMillis() : now);
  const ageDays = Math.max(0, (now - createdMs) / (1000 * 60 * 60 * 24));
  return Math.max(0.5, 1.0 - (ageDays / 60) * 0.5);
}

/**
 * Chunks a single community post with metadata and type weighting.
 */
export function chunkPost(post, maxChunkTokens = 400) {
  if (!post || typeof post !== "object") return [];

  const title = stripMarkdown(post.title || "");
  const content = stripMarkdown(post.content || "");
  const fullText = title ? `${title}. ${content}` : content;

  if (!fullText.trim()) return [];

  const typeWeight = POST_TYPE_WEIGHTS[post.type] || 1.0;
  const recencyMultiplier = calculateRecencyScore(post.createdAt);
  const totalWeight = typeWeight * recencyMultiplier;

  const chunks = chunkText(fullText, maxChunkTokens);

  return chunks.map((chunk, index) => ({
    postId: post.id || `post_${index}`,
    postTitle: post.title || "Untitled Post",
    postType: post.type || "Experience",
    chunkIndex: index,
    chunk,
    weight: totalWeight,
    tokenCount: estimateTokens(chunk),
  }));
}

/**
 * Chunks an array of community posts into a normalized searchable chunk pool.
 */
export function chunkPosts(posts, maxChunkTokens = 400) {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  const allChunks = [];
  for (const post of posts) {
    const postChunks = chunkPost(post, maxChunkTokens);
    allChunks.push(...postChunks);
  }

  return allChunks;
}

/**
 * Fetches recent community posts from Firestore.
 */
export async function fetchCommunityPosts(db = adminDb, limit = 50) {
  if (!db || typeof db.collection !== "function") {
    return [];
  }

  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    return [];
  }
}
