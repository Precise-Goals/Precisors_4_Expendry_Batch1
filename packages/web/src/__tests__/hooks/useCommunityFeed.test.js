import { describe, it, expect } from "bun:test";
import { feedCache, SWR_TTL_MS } from "../../hooks/useCommunityFeed";

describe("useCommunityFeed SWR Caching Unit Tests", () => {
  it("initializes feedCache as a Map", () => {
    expect(feedCache instanceof Map).toBe(true);
  });

  it("defines 60 second SWR TTL constant", () => {
    expect(SWR_TTL_MS).toBe(60000);
  });

  it("stores and retrieves cached post records with timestamps", () => {
    const key = "Experience_1_10";
    const sample = {
      posts: [{ id: "test-1", title: "Test Post", type: "Experience" }],
      hasMore: false,
      timestamp: Date.now(),
    };

    feedCache.set(key, sample);
    const retrieved = feedCache.get(key);

    expect(retrieved).toBeDefined();
    expect(retrieved.posts.length).toBe(1);
    expect(retrieved.posts[0].id).toBe("test-1");
    expect(Date.now() - retrieved.timestamp).toBeLessThan(1000);

    // Clean up
    feedCache.delete(key);
  });
});
