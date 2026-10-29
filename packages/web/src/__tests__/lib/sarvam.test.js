import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  chat,
  transcribe,
  synthesise,
  setSarvamFetch,
  SarvamError,
  normalizeLanguage,
  detectLanguage,
  redactSensitive,
  SARVAM_MODEL,
} from "../../lib/sarvam.js";

describe("Sarvam AI Client SDK Unit Tests", () => {
  let originalApiKey;

  beforeEach(() => {
    originalApiKey = process.env.SARVAM_API_KEY;
    process.env.SARVAM_API_KEY = "test-sarvam-secret-api-key-12345";
  });

  afterEach(() => {
    process.env.SARVAM_API_KEY = originalApiKey;
    setSarvamFetch(null);
  });

  describe("API Key Redaction & Language Normalization", () => {
    it("redacts secret API key from strings and error representations", () => {
      const sensitive = `Connection failed with api-subscription-key="test-sarvam-secret-api-key-12345"`;
      const cleaned = redactSensitive(sensitive);
      expect(cleaned).not.toContain("test-sarvam-secret-api-key-12345");
      expect(cleaned).toContain("[REDACTED_API_KEY]");
    });

    it("normalizes language codes to supported values (en, hi, mr) and defaults to en", () => {
      expect(normalizeLanguage("en")).toBe("en");
      expect(normalizeLanguage("HI")).toBe("hi");
      expect(normalizeLanguage("mr")).toBe("mr");
      expect(normalizeLanguage("de")).toBe("en");
      expect(normalizeLanguage("")).toBe("en");
      expect(normalizeLanguage(null)).toBe("en");
    });

    it("detects English queries automatically", () => {
      expect(detectLanguage("How do I reduce lathe chatter on Inconel 718?")).toBe("en");
      expect(detectLanguage("Carbide insert notch wear prevention tips")).toBe("en");
      expect(detectLanguage("")).toBe("en");
      expect(detectLanguage(null)).toBe("en");
    });

    it("detects Hindi Devanagari and Hinglish queries automatically", () => {
      expect(detectLanguage("खराद मशीन पर टूल चयन कैसे करें?")).toBe("hi");
      expect(detectLanguage("इनकोनेल 718 पर कटिंग स्पीड क्या होनी चाहिए?")).toBe("hi");
      expect(detectLanguage("lathe machine par cutting speed kaise set kare?")).toBe("hi");
    });

    it("detects Marathi Devanagari and Romanized Marathi queries automatically", () => {
      expect(detectLanguage("खराद मशीनवर टूल रनआउट कसा तपासायचा?")).toBe("mr");
      expect(detectLanguage("व्हीएमसी मिलिंग करताना व्हायब्रेशन कसे कमी करावे?")).toBe("mr");
      expect(detectLanguage("वेगळा कटर वापरा")).toBe("mr");
      expect(detectLanguage("lathe machine var tool runout kasa check karaycha?")).toBe("mr");
    });
  });

  describe("Chat Wrapper & Exponential Backoff on 429", () => {
    it("200 OK returns parsed JSON with resolved language", async () => {
      const mockResponse = {
        choices: [{ message: { content: "Optimal cutting speed is 120 m/min." } }],
      };

      let capturedUrl = "";
      let capturedOptions = null;

      setSarvamFetch(async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          status: 200,
          json: async () => mockResponse,
        };
      });

      const res = await chat([{ role: "user", content: "Lathe cutting speed?" }], "hi");
      expect(res.choices[0].message.content).toBe("Optimal cutting speed is 120 m/min.");
      expect(res.resolvedLang).toBe("hi");
      expect(capturedUrl).toContain("/v1/chat/completions");
      expect(capturedOptions.headers["x-sarvam-language"]).toBe("hi");
      expect(capturedOptions.headers["api-subscription-key"]).toBe("test-sarvam-secret-api-key-12345");

      const body = JSON.parse(capturedOptions.body);
      expect(body.model).toBe(SARVAM_MODEL);
      expect(body.language).toBe("hi");
    });

    it("chat auto-detects language from user message when lang is auto", async () => {
      let capturedBody = null;
      setSarvamFetch(async (url, options) => {
        capturedBody = JSON.parse(options.body);
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: "मशीनिंग उत्तर" } }] }),
        };
      });

      const res = await chat(
        [{ role: "user", content: "खराद मशीनवर टूल रनआउट कसा तपासायचा?" }],
        "auto"
      );
      expect(res.resolvedLang).toBe("mr");
      expect(capturedBody.language).toBe("mr");
    });

    it("retries on 429 and succeeds if rate limit clears within 3 attempts", async () => {
      let callCount = 0;

      setSarvamFetch(async () => {
        callCount++;
        if (callCount < 3) {
          return {
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            text: async () => "Rate limit exceeded",
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: "Success after backoff" } }] }),
        };
      });

      const res = await chat([{ role: "user", content: "Test retry" }]);
      expect(callCount).toBe(3);
      expect(res.choices[0].message.content).toBe("Success after backoff");
    });

    it("throws SarvamError with 429 if rate limit persists after max retries", async () => {
      let callCount = 0;

      setSarvamFetch(async () => {
        callCount++;
        return {
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          text: async () => "Persistent rate limit",
        };
      });

      try {
        await chat([{ role: "user", content: "Test failure" }]);
        expect(true).toBe(false); // Should not reach
      } catch (err) {
        expect(err).toBeInstanceOf(SarvamError);
        expect(err.status).toBe(429);
        expect(err.message).toContain("Rate limit exceeded");
      }
      expect(callCount).toBe(4); // Initial + 3 retries
    });

    it("throws SarvamError with 500 on server errors", async () => {
      setSarvamFetch(async () => {
        return {
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          text: async () => "Internal server error occurred",
        };
      });

      try {
        await chat([{ role: "user", content: "Hello" }]);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(SarvamError);
        expect(err.status).toBe(500);
      }
    });
  });

  describe("STT (Transcribe) and TTS (Synthesise) Wrappers", () => {
    it("transcribes audio blob and maps language code", async () => {
      let capturedBody = null;
      let capturedHeaders = null;

      setSarvamFetch(async (url, options) => {
        capturedBody = options.body;
        capturedHeaders = options.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({ transcript: "मशीनिंग गाइड" }),
        };
      });

      const fakeBlob = new Blob(["dummy audio bytes"], { type: "audio/webm" });
      const result = await transcribe(fakeBlob, "mr");

      expect(result.transcript).toBe("मशीनिंग गाइड");
      expect(result.language).toBe("mr");
      expect(capturedHeaders["x-sarvam-language"]).toBe("mr");
      expect(capturedBody).toBeInstanceOf(FormData);
    });

    it("rejects empty audio payload in transcribe", async () => {
      expect(transcribe(null)).rejects.toBeInstanceOf(SarvamError);
    });

    it("synthesises text into audio base64 payload", async () => {
      setSarvamFetch(async (url, options) => {
        const body = JSON.parse(options.body);
        expect(body.inputs[0]).toBe("Spindle RPM set to 1500.");
        expect(body.target_language_code).toBe("en-IN");
        return {
          ok: true,
          status: 200,
          json: async () => ({ audios: ["base64EncodedAudioDataString=="] }),
        };
      });

      const result = await synthesise("Spindle RPM set to 1500.", "en");
      expect(result.audio).toBe("base64EncodedAudioDataString==");
      expect(result.language).toBe("en");
    });

    it("rejects empty text in synthesise", async () => {
      expect(synthesise("")).rejects.toBeInstanceOf(SarvamError);
      expect(synthesise(null)).rejects.toBeInstanceOf(SarvamError);
    });
  });
});
