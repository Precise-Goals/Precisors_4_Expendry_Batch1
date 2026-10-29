/**
 * Sarvam AI Client SDK Wrapper
 *
 * Implements chat, STT (transcribe), and TTS (synthesise) wrappers for Sarvam AI.
 * Enforces exponential backoff on 429 rate limits (<=3 retries),
 * redacts API keys from all error messages and logs, and defaults to 'en'.
 */

export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  SARVAM_LANGUAGE_CODES,
  normalizeLanguage,
  detectLanguage,
} from "./language.js";

import {
  DEFAULT_LANGUAGE,
  SARVAM_LANGUAGE_CODES,
  normalizeLanguage,
  detectLanguage,
} from "./language.js";

export const SARVAM_MODEL = "sarvam-105b-conversations";

export class SarvamError extends Error {
  constructor(message, status = 500) {
    super(redactSensitive(message));
    this.name = "SarvamError";
    this.status = status;
  }
}

let injectedFetch = null;

export function setSarvamFetch(fn) {
  injectedFetch = fn;
}

function getFetch() {
  return injectedFetch || globalThis.fetch;
}

export function getApiKey() {
  if (typeof process !== "undefined" && process.env?.SARVAM_API_KEY) {
    return process.env.SARVAM_API_KEY;
  }
  if (typeof window === "undefined") {
    try {
      // Dynamic require avoids bundling fs/path in client bundles
      const fsMod = eval('require("fs")');
      const pathMod = eval('require("path")');
      const cwd = process.cwd();
      const candidates = [
        pathMod.resolve(cwd, ".env"),
        pathMod.resolve(cwd, ".env.local"),
        pathMod.resolve(cwd, "packages/web/.env"),
        pathMod.resolve(cwd, "packages/web/.env.local"),
        pathMod.resolve(cwd, "../../.env"),
        pathMod.resolve(cwd, "../.env"),
      ];
      for (const p of candidates) {
        if (fsMod.existsSync(p)) {
          const content = fsMod.readFileSync(p, "utf-8");
          const match = content.match(/^SARVAM_API_KEY\s*=\s*(.+)$/m);
          if (match) {
            const val = match[1].trim().replace(/^["']|["']$/g, "");
            process.env.SARVAM_API_KEY = val;
            return val;
          }
        }
      }
    } catch {}
  }
  return "";
}

function getBaseUrl() {
  return (typeof process !== "undefined" && process.env?.SARVAM_BASE_URL) || "https://api.sarvam.ai";
}

export function redactSensitive(input) {
  if (typeof input !== "string") {
    try {
      input = JSON.stringify(input);
    } catch {
      return "[Unserializable]";
    }
  }

  const key = getApiKey();
  let sanitized = input;
  if (key && key.length > 4) {
    sanitized = sanitized.replaceAll(key, "[REDACTED_API_KEY]");
  }
  // Generic pattern redaction for bearer or api keys
  return sanitized
    .replace(/(api-subscription-key[:=]\s*)['"][^'"]+['"]/gi, '$1"[REDACTED_API_KEY]"')
    .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]{10,}/gi, "$1[REDACTED_API_KEY]");
}

async function fetchWithRetry(url, options, maxRetries = 3, initialDelayMs = 200) {
  const fetchFn = getFetch();
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetchFn(url, options);

      if (response.status === 429) {
        if (attempt >= maxRetries) {
          throw new SarvamError(
            `Sarvam API Rate limit exceeded (429) after ${maxRetries} retries`,
            429
          );
        }
        const delay = initialDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
        continue;
      }

      if (!response.ok) {
        let errorBody = "";
        try {
          errorBody = await response.text();
        } catch {
          errorBody = response.statusText;
        }
        throw new SarvamError(
          `Sarvam API request failed [${response.status}]: ${redactSensitive(errorBody)}`,
          response.status
        );
      }

      return response;
    } catch (err) {
      if (err instanceof SarvamError) {
        throw err;
      }
      if (attempt >= maxRetries) {
        throw new SarvamError(
          `Sarvam network failure: ${redactSensitive(err.message)}`,
          500
        );
      }
      const delay = initialDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }
}

/**
 * Chat completion via Sarvam AI.
 * Supports streaming or standard response.
 */
export async function chat(messages, lang = DEFAULT_LANGUAGE, options = {}) {
  let resolvedLang;
  if (!lang || lang === "auto") {
    const lastUserMsg = Array.isArray(messages)
      ? [...messages].reverse().find((m) => m && m.role === "user")
      : null;
    resolvedLang = lastUserMsg ? detectLanguage(lastUserMsg.content) : DEFAULT_LANGUAGE;
  } else {
    resolvedLang = normalizeLanguage(lang);
  }
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();
  const stream = !!options.stream;

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { "api-subscription-key": apiKey } : {}),
    "x-sarvam-language": resolvedLang,
  };

  const payload = {
    model: options.model || SARVAM_MODEL,
    messages,
    stream,
    language: resolvedLang,
    temperature: options.temperature ?? 0.3,
  };

  const response = await fetchWithRetry(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (stream) {
    return response;
  }

  const data = await response.json();
  return {
    ...data,
    resolvedLang,
  };
}

/**
 * Transcribes audio blob using Sarvam Speech-to-Text.
 */
export async function transcribe(audioBlob, lang = DEFAULT_LANGUAGE) {
  if (!audioBlob) {
    throw new SarvamError("Missing audio payload for transcription", 400);
  }

  const resolvedLang = normalizeLanguage(lang, "auto");
  const langCode = SARVAM_LANGUAGE_CODES[resolvedLang] || "unknown";
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "saaras:v1");
  formData.append("language_code", langCode);

  const headers = {
    ...(apiKey ? { "api-subscription-key": apiKey } : {}),
    "x-sarvam-language": resolvedLang,
  };

  const response = await fetchWithRetry(`${baseUrl}/speech-to-text`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();
  return {
    transcript: data.transcript || data.text || "",
    language: resolvedLang,
  };
}

/**
 * Synthesises text into audio using Sarvam Text-to-Speech.
 */
export async function synthesise(text, lang = DEFAULT_LANGUAGE) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new SarvamError("Text is required for audio synthesis", 400);
  }

  const resolvedLang = normalizeLanguage(lang);
  const langCode = SARVAM_LANGUAGE_CODES[resolvedLang] || "en-IN";
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { "api-subscription-key": apiKey } : {}),
    "x-sarvam-language": resolvedLang,
  };

  const payload = {
    inputs: [text],
    target_language_code: langCode,
    speaker: "meera",
    model: "bulbul:v1",
  };

  const response = await fetchWithRetry(`${baseUrl}/text-to-speech`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const audioBase64 = data.audios ? data.audios[0] : (data.audio || "");

  return {
    audio: audioBase64,
    language: resolvedLang,
  };
}
