import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import crypto from 'crypto';
import { ethers } from "ethers";
import { POST as createPost, setPostsDependencies } from "../../app/api/posts/route.js";
import { setRewardDependencies, dailyTallies } from "../../lib/reward.js";

describe("POST /api/posts Integration Tests", () => {
  let authorWallet;
  let storedPosts;
  let mockDb;
  let mockContract;

  beforeEach(() => {
    authorWallet = ethers.Wallet.createRandom().address.toLowerCase();
    storedPosts = new Map();
    dailyTallies.clear();

    mockContract = {
      mint: async (to, amount) => ({
        hash: ethers.hexlify(ethers.randomBytes(32)),
      }),
    };

    mockDb = {
      collection: (colName) => ({
        add: async (data) => {
          const id = `post_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
          storedPosts.set(id, data);
          return { id };
        },
        doc: (docId) => ({
          get: async () => {
            if (storedPosts.has(docId)) {
              return { exists: true, data: () => storedPosts.get(docId) };
            }
            return { exists: false, data: () => null };
          },
          set: async (data) => {
            storedPosts.set(docId, data);
          },
        }),
      }),
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

  it("happy path: validates post, writes to Firestore, mints EXPEN, and returns 201 + txHash", async () => {
    const postPayload = {
      title: "Vibration Dampening for Slender Boring Bars",
      content:
        "Tuning spindle speed to avoid torsional resonance during deep internal boring in titanium alloy.",
      type: "Setup Tip",
      authorWallet,
    };

    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postPayload),
    });

    const res = await createPost(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.postId).toBeDefined();
    expect(data.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(data.expenRewarded).toBe(10);

    // Verify Firestore record created
    expect(storedPosts.has(data.postId)).toBe(true);
    const saved = storedPosts.get(data.postId);
    expect(saved.title).toBe(postPayload.title);
    expect(saved.authorWallet).toBe(authorWallet);
    expect(saved.rewarded).toBe(true);
    expect(saved.txHash).toBe(data.txHash);
  });

  it("returns 400 Bad Request when missing content or title is too short", async () => {
    // Missing title
    const req1 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Valid length content for machining instructions.",
        type: "Blueprint",
        authorWallet,
      }),
    });
    const res1 = await createPost(req1);
    expect(res1.status).toBe(400);
    const data1 = await res1.json();
    expect(data1.error).toContain("Title is required");

    // Title too short (< 3 chars)
    const req2 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Hi",
        content: "Valid length content for machining instructions.",
        type: "Blueprint",
        authorWallet,
      }),
    });
    const res2 = await createPost(req2);
    expect(res2.status).toBe(400);

    // Content too short (< 10 chars)
    const req3 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Title Here",
        content: "Short",
        type: "Blueprint",
        authorWallet,
      }),
    });
    const res3 = await createPost(req3);
    expect(res3.status).toBe(400);
    const data3 = await res3.json();
    expect(data3.error).toContain("Content is required");
  });

  it("returns 400 Bad Request when post type is not in POST_TYPES enum", async () => {
    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Title Here",
        content: "Detailed description of lathe cutting parameters.",
        type: "InvalidCustomType",
        authorWallet,
      }),
    });

    const res = await createPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Post type must be one of");
  });

  it("returns 401 Unauthorized when authorWallet is missing or invalid", async () => {
    // Missing wallet
    const req1 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Title Here",
        content: "Detailed description of lathe cutting parameters.",
        type: "Setup Tip",
      }),
    });
    const res1 = await createPost(req1);
    expect(res1.status).toBe(401);

    // Invalid zero address
    const req2 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Title Here",
        content: "Detailed description of lathe cutting parameters.",
        type: "Setup Tip",
        authorWallet: "0x0000000000000000000000000000000000000000",
      }),
    });
    const res2 = await createPost(req2);
    expect(res2.status).toBe(401);
  });

  it("returns 429 Too Many Requests when wallet reaches the 50 EXPEN daily cap", async () => {
    const postPayload = {
      title: "Daily Cap Test Post",
      content: "Documenting consecutive machining setups to verify daily cap boundary.",
      type: "Experience",
      authorWallet,
    };

    // First 5 posts succeed (5 * 10 = 50 EXPEN)
    for (let i = 1; i <= 5; i++) {
      const req = new Request("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
      const res = await createPost(req);
      expect(res.status).toBe(201);
    }

    // 6th post must return 429 Too Many Requests
    const req6 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postPayload),
    });
    const res6 = await createPost(req6);
    expect(res6.status).toBe(429);

    const data6 = await res6.json();
    expect(data6.error).toContain("Daily reward cap of 50 EXPEN reached");
  });

  it("sanitises XSS payloads and strips HTML tags with DOMPurify before Firestore write", async () => {
    const xssPayload = {
      title: "CNC Spindle <script>alert('xss')</script>Setup Guide",
      content:
        "Calibrating runout <img src=x onerror=alert(1)> with a dial test indicator on stainless steel shaft.",
      type: "Setup Tip",
      authorWallet,
    };

    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(xssPayload),
    });

    const res = await createPost(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.postId).toBeDefined();

    const saved = storedPosts.get(data.postId);
    expect(saved).toBeDefined();
    // Verify script and img onerror tags are stripped
    expect(saved.title).toBe("CNC Spindle Setup Guide");
    expect(saved.title).not.toContain("<script>");
    expect(saved.title).not.toContain("alert");
    expect(saved.content).toBe(
      "Calibrating runout  with a dial test indicator on stainless steel shaft."
    );
    expect(saved.content).not.toContain("<img");
    expect(saved.content).not.toContain("onerror");
  });

  it("rejects post if payload consists solely of HTML tags that sanitize to empty", async () => {
    const maliciousPayload = {
      title: "<script>alert(1)</script>",
      content: "<style>body{color:red}</style><div><span></span></div>",
      type: "Setup Tip",
      authorWallet,
    };

    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maliciousPayload),
    });

    const res = await createPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Title is required");
  });

  it("rejects payload attempting prototype pollution", async () => {
    const pollutionPayload = JSON.parse(
      '{"title": "Valid Title", "content": "Valid content length for machining", "type": "Setup Tip", "authorWallet": "' +
        authorWallet +
        '", "__proto__": {"polluted": true}}'
    );

    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollutionPayload),
    });

    const res = await createPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Prototype pollution");
  });

  it("rejects post with oversized title exceeding 200 characters", async () => {
    const longTitle = "A".repeat(201);
    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: longTitle,
        content: "Valid machining instruction content with proper length.",
        type: "Setup Tip",
        authorWallet,
      }),
    });

    const res = await createPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Title must not exceed 200 characters");
  });

  it("rejects post with oversized content exceeding 10000 characters", async () => {
    const longContent = "B".repeat(10001);
    const req = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Valid Title",
        content: longContent,
        type: "Setup Tip",
        authorWallet,
      }),
    });

    const res = await createPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Content must not exceed 10000 characters");
  });
});
