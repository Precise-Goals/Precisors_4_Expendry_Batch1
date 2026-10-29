import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { POST as agentPost, setAgentDependencies, clearRateLimits } from "../../app/api/agent/route.js";
import { POST as transcribePost, setTranscribeDependencies } from "../../app/api/agent/transcribe/route.js";

describe("Agent & Audio API Stress & Boundary Verification (/api/agent & /api/agent/transcribe)", () => {
  beforeEach(() => {
    clearRateLimits();

    setAgentDependencies({
      assembleContext: async (msg) => ({
        contextText: "Grounded context for " + msg,
        sources: [{ id: "src_1", title: "Machining Lathe Tip", expenReward: 10 }],
        tokenCount: 42,
      }),
      chat: async () => ({
        choices: [{ message: { content: "Streaming response token" } }],
      }),
    });

    setTranscribeDependencies({
      transcribe: async () => ({ transcript: "Verified audio transcript" }),
    });
  });

  afterEach(() => {
    setAgentDependencies(null);
    setTranscribeDependencies(null);
  });

  it("enforces 20 requests per minute rate limit and returns 429 with Retry-After header on the 21st request", async () => {
    const makeReq = () =>
      agentPost(
        new Request("http://localhost:3000/api/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.0.2.100",
          },
          body: JSON.stringify({ message: "Feeds and speeds for Inconel 718" }),
        })
      );

    // 20 requests allowed
    for (let i = 0; i < 20; i++) {
      const res = await makeReq();
      expect(res.status).toBe(200);
    }

    // 21st request blocked
    const blockedRes = await makeReq();
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get("Retry-After")).toBeDefined();
    const data = await blockedRes.json();
    expect(data.error).toContain("Rate limit exceeded");
  });

  it("returns streaming SSE text/event-stream content for valid chat requests", async () => {
    const res = await agentPost(
      new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.0.2.200",
        },
        body: JSON.stringify({
          message: "How to avoid tool chatter on lathe?",
          lang: "auto",
        }),
      })
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
    }

    expect(accumulated).toContain("data:");
    expect(accumulated).toContain('"done":true');
    expect(accumulated).toContain("sources");
  });

  it("rejects prototype pollution attempts in agent payload with 400 Bad Request", async () => {
    const res = await agentPost(
      new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"__proto__": {"polluted": true}, "message": "Test"}',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Prototype pollution");
  });

  it("strictly rejects audio payloads exceeding the 10MB maximum allowance (>60s audio cap)", async () => {
    const oversizedBlob = new Blob([new Uint8Array(11 * 1024 * 1024)], { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", oversizedBlob, "large_audio.webm");

    const res = await transcribePost(
      new Request("http://localhost:3000/api/agent/transcribe", {
        method: "POST",
        body: formData,
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("exceeds maximum 60-second duration allowance");
  });

  it("rejects transcription requests with missing audio file", async () => {
    const formData = new FormData();
    formData.append("lang", "en");

    const res = await transcribePost(
      new Request("http://localhost:3000/api/agent/transcribe", {
        method: "POST",
        body: formData,
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Audio file is required");
  });
});
