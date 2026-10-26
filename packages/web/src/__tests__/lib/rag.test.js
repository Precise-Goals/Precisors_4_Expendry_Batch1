import { describe, it, expect } from "bun:test";
import {
  stripMarkdown,
  estimateTokens,
  chunkText,
  chunkPost,
  chunkPosts,
  fetchCommunityPosts,
  calculateRecencyScore,
  POST_TYPE_WEIGHTS,
  scoreBM25Lite,
  assembleContext,
} from "../../lib/rag.js";

describe("RAG Engine Post Chunker & Normalizer Unit Tests", () => {
  describe("Markdown Stripping & Token Estimation", () => {
    it("strips complex markdown, codeblocks, links, and headers", () => {
      const markdown = `
# Machining Titanium Ti-6Al-4V
**Warning**: Never run dry. Use *generous coolant*.
\`\`\`gcode
G00 X0 Y0 Z5
G01 Z-2 F100
\`\`\`
Check [Machining Handbook](https://example.com/handbook) for details.
- Use sharp carbide inserts
- Maintain positive rake angle
> Always inspect tool wear after 20 passes.
`;
      const stripped = stripMarkdown(markdown);
      expect(stripped).not.toContain("#");
      expect(stripped).not.toContain("**");
      expect(stripped).not.toContain("```");
      expect(stripped).not.toContain("[Machining Handbook]");
      expect(stripped).toContain("Machining Handbook");
      expect(stripped).toContain("Use sharp carbide inserts");
      expect(stripped).toContain("Never run dry");
    });

    it("accurately estimates token count for English and Devanagari text", () => {
      const enText = "Carbide end mill feeds and speeds for high speed machining.";
      const hiText = "मशीनिंग ऑपरेशन में कूलेंट का उपयोग बहुत आवश्यक है।";

      expect(estimateTokens("")).toBe(0);
      expect(estimateTokens(enText)).toBeGreaterThan(10);
      expect(estimateTokens(hiText)).toBeGreaterThan(10);
    });
  });

  describe("Sentence Boundary & Chunk Size Enforcement", () => {
    it("chunks text on sentence boundaries and respects token limits", () => {
      const text =
        "First sentence on tool clearance. " +
        "Second sentence discussing spindle speeds. " +
        "Third sentence on chip evacuation. " +
        "Fourth sentence detailing workpiece clamping rigidity. " +
        "Fifth sentence on coolant nozzles orientation.";

      const chunks = chunkText(text, 25);
      expect(chunks.length).toBeGreaterThan(1);
      for (const chunk of chunks) {
        expect(estimateTokens(chunk)).toBeLessThanOrEqual(35);
        expect(chunk.length).toBeGreaterThan(0);
      }
    });

    it("respects Devanagari danda sentence boundaries", () => {
      const text =
        "खराद मशीन पर कार्य करते समय सुरक्षा चश्मा पहनें। टूल को सही कोण पर सेट करें।";
      const chunks = chunkText(text, 15);
      expect(chunks.length).toBeGreaterThanOrEqual(1);
    });

    it("returns empty array for empty, whitespace, or invalid input", () => {
      expect(chunkText("")).toEqual([]);
      expect(chunkText("   ")).toEqual([]);
      expect(chunkText(null)).toEqual([]);
      expect(chunkText(undefined)).toEqual([]);
    });
  });

  describe("Post Type Weighting & Recency Multiplier", () => {
    it("assigns 1.5x weight to Blueprint and 1.3x to Setup Tip", () => {
      const blueprintPost = {
        id: "p-bp",
        title: "Titanium Milling Blueprint",
        content: "Detailed geometric blueprint and cutter engagement limits.",
        type: "Blueprint",
        createdAt: Date.now(),
      };

      const setupTipPost = {
        id: "p-st",
        title: "Vise Clamping Setup Tip",
        content: "Always use torque wrench to tighten modular vise jaws to 35Nm.",
        type: "Setup Tip",
        createdAt: Date.now(),
      };

      const expPost = {
        id: "p-exp",
        title: "Shop Floor Experience",
        content: "Observations on chatter vibration when turning long shafts.",
        type: "Experience",
        createdAt: Date.now(),
      };

      const bpChunks = chunkPost(blueprintPost);
      const stChunks = chunkPost(setupTipPost);
      const expChunks = chunkPost(expPost);

      expect(bpChunks[0].weight).toBeCloseTo(1.5, 1);
      expect(stChunks[0].weight).toBeCloseTo(1.3, 1);
      expect(expChunks[0].weight).toBeCloseTo(1.0, 1);
    });

    it("produces deterministic output for identical input", () => {
      const post = {
        id: "p-det",
        title: "Deterministic Thread Turning",
        content: "Compound slide set at 29.5 degrees for 60-degree metric threads.",
        type: "Blueprint",
        createdAt: 1700000000000,
      };

      const run1 = chunkPost(post);
      const run2 = chunkPost(post);

      expect(run1).toEqual(run2);
    });

    it("applies recency decay for older posts", () => {
      const recentScore = calculateRecencyScore(Date.now());
      const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
      const oldScore = calculateRecencyScore(sixtyDaysAgo);

      expect(recentScore).toBeCloseTo(1.0, 2);
      expect(oldScore).toBeCloseTo(0.5, 2);
    });
  });

  describe("Batch Post Processing & Firestore Retrieval", () => {
    it("returns empty array when given empty posts list or invalid post objects", () => {
      expect(chunkPosts([])).toEqual([]);
      expect(chunkPosts(null)).toEqual([]);
      expect(chunkPost(null)).toEqual([]);
    });

    it("flattens and chunks multiple posts", () => {
      const posts = [
        {
          id: "p1",
          title: "Post 1",
          content: "First post content for chunking.",
          type: "Experience",
        },
        {
          id: "p2",
          title: "Post 2",
          content: "Second post content for chunking.",
          type: "Blueprint",
        },
      ];

      const chunks = chunkPosts(posts);
      expect(chunks.length).toBe(2);
      expect(chunks[0].postId).toBe("p1");
      expect(chunks[1].postId).toBe("p2");
    });

    it("handles fetchCommunityPosts with empty or simulated database", async () => {
      const emptyDb = {
        collection: () => ({
          orderBy: () => ({
            limit: () => ({
              get: async () => ({ docs: [] }),
            }),
          }),
        }),
      };

      const posts = await fetchCommunityPosts(emptyDb);
      expect(posts).toEqual([]);

      const nullDbResult = await fetchCommunityPosts(null);
      expect(nullDbResult).toEqual([]);
    });
  });

  describe("BM25-Lite Scoring & Context Assembler", () => {
    it("scores matching keywords with BM25-lite term frequency saturation", () => {
      const query = "carbide end mill feeds";
      const chunk1 = "For a carbide end mill, feeds and speeds should be calculated carefully.";
      const chunk2 = "General maintenance tips for lubrication pump.";

      const score1 = scoreBM25Lite(query, chunk1);
      const score2 = scoreBM25Lite(query, chunk2);

      expect(score1).toBeGreaterThan(0);
      expect(score2).toBe(0);
      expect(score1).toBeGreaterThan(score2);
    });

    it("assembles ranked top-K context within max token limits", async () => {
      const posts = [
        {
          id: "p-101",
          title: "Titanium Ti-6Al-4V Milling Handbook",
          content: "Use sharp positive rake geometry carbide inserts with copious emulsion coolant to mill titanium alloys.",
          type: "Blueprint",
        },
        {
          id: "p-102",
          title: "Brass Turning Speeds",
          content: "Free-cutting brass can be turned dry at high surface speeds with zero rake angle.",
          type: "Setup Tip",
        },
      ];

      const ctx = await assembleContext("titanium milling coolant", posts, 5, 1500);
      expect(ctx.contextText).toContain("Titanium Ti-6Al-4V");
      expect(ctx.sources.length).toBe(1);
      expect(ctx.sources[0].id).toBe("p-101");
      expect(ctx.sources[0].type).toBe("Blueprint");
      expect(ctx.tokenCount).toBeLessThanOrEqual(1500);
    });

    it("handles empty query or empty posts gracefully without crashing", async () => {
      const emptyQuery = await assembleContext("", [{ id: "p1", title: "Test", content: "Test" }]);
      expect(emptyQuery.contextText).toBe("");
      expect(emptyQuery.sources).toEqual([]);

      const emptyPosts = await assembleContext("titanium", []);
      expect(emptyPosts.contextText).toBe("");
      expect(emptyPosts.sources).toEqual([]);
    });
  });
});

