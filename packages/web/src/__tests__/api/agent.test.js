import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  POST as agentHandler,
  setAgentDependencies,
  clearRateLimits,
} from "../../app/api/agent/route.js";
import {
  POST as transcribeHandler,
  setTranscribeDependencies,
} from "../../app/api/agent/transcribe/route.js";

describe("Agent API Routes Integration Tests", () => {
  beforeEach(() => {
    clearRateLimits();
    setAgentDependencies(null);
    setTranscribeDependencies(null);
  });

  afterEach(() => {
    clearRateLimits();
    setAgentDependencies(null);
    setTranscribeDependencies(null);
  });

  describe("POST /api/agent — RAG Context Injection & Streaming Chat", () => {
    it("matching posts inject context and return SSE streaming response with sources", async () => {
      setAgentDependencies({
        assembleContext: async () => {
          return {
            contextText: `[Source: Titanium Milling Speeds and Feeds (Blueprint)]: Keep surface speed below 35 m/min.`,
            sources: [{ id: "p-titanium", title: "Titanium Milling Speeds and Feeds", type: "Blueprint" }],
            tokenCount: 45,
          };
        },
      });

      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.101",
        },
        body: JSON.stringify({
          message: "What feeds should I use for titanium?",
          lang: "en",
        }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/event-stream");
      expect(response.headers.get("X-RateLimit-Limit")).toBe("20");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
      }

      expect(streamText).toContain("data: {");
      expect(streamText).toContain('"done":false');
      expect(streamText).toContain('"done":true');
      expect(streamText).toContain("Titanium Milling Speeds and Feeds");
    });

    it("empty community posts responds gracefully without crashing", async () => {
      setAgentDependencies({
        assembleContext: async () => ({
          contextText: "",
          sources: [],
          tokenCount: 0,
        }),
      });

      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.102",
        },
        body: JSON.stringify({
          message: "Hello world",
          lang: "hi",
        }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(200);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
      }

      expect(streamText).toContain('"done":true');
      expect(streamText).toContain('"sources":[]');
    });

    it("defaults unknown language to English", async () => {
      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.103",
        },
        body: JSON.stringify({
          message: "Testing unknown language",
          lang: "de", // German not in [en, hi, mr]
        }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(200);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
      }

      expect(streamText).toContain('"resolvedLang":"en"');
    });

    it("automatically detects Hindi and responds in Hindi when lang is omitted", async () => {
      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.104",
        },
        body: JSON.stringify({
          message: "खराद मशीन पर टूल चयन कैसे करें?",
        }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(200);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
      }

      expect(streamText).toContain('"resolvedLang":"hi"');
      expect(streamText).toMatch(/[\u0900-\u097F]/); // Real Hindi Devanagari content
    });

    it("automatically detects Marathi and responds in Marathi when lang is auto", async () => {
      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.105",
        },
        body: JSON.stringify({
          message: "खराद मशीनवर टूल रनआउट कसा तपासायचा?",
          lang: "auto",
        }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(200);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamText += decoder.decode(value);
      }

      expect(streamText).toContain('"resolvedLang":"mr"');
      expect(streamText).toMatch(/[\u0900-\u097F]/); // Real Marathi Devanagari content
    });

    it("returns 400 Bad Request for empty message payload", async () => {
      const request = new Request("http://localhost:3000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "   " }),
      });

      const response = await agentHandler(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBeDefined();
    });

    it("enforces rate limit of 20 requests per minute per IP", async () => {
      const makeReq = () =>
        new Request("http://localhost:3000/api/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "10.0.0.99",
          },
          body: JSON.stringify({ message: "Ping" }),
        });

      for (let i = 0; i < 20; i++) {
        const res = await agentHandler(makeReq());
        expect(res.status).toBe(200);
      }

      const throttledRes = await agentHandler(makeReq());
      expect(throttledRes.status).toBe(429);
      expect(throttledRes.headers.get("Retry-After")).toBeDefined();
    });
  });

  describe("POST /api/agent/transcribe — Audio Transcription", () => {
    it("returns 400 when missing audio payload", async () => {
      const formData = new FormData();
      formData.append("lang", "en");

      const request = new Request("http://localhost:3000/api/agent/transcribe", {
        method: "POST",
        body: formData,
      });

      const response = await transcribeHandler(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toContain("Audio file is required");
    });

    it("returns transcript for valid audio file payload", async () => {
      const mockAudio = new Blob(["fake-audio-bytes"], { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", mockAudio, "test.webm");
      formData.append("lang", "en");

      setTranscribeDependencies({
        transcribe: async () => ({
          transcript: "Inconel 718 surface finish chatter troubleshooting",
          language: "en",
        }),
      });

      const request = new Request("http://localhost:3000/api/agent/transcribe", {
        method: "POST",
        body: formData,
      });

      const response = await transcribeHandler(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.transcript).toContain("Inconel 718");
    });
  });
});
