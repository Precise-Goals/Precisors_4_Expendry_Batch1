/**
 * Sarvam AI Client SDK Wrapper
 *
 * Implements chat, STT (transcribe), and TTS (synthesise) wrappers for Sarvam AI.
 * Enforces exponential backoff on 429 rate limits (<=3 retries),
 * redacts API keys from all error messages and logs, and defaults to 'en'.
 */

export const SARVAM_MODEL = "sarvam-105b-conversations";
export const SUPPORTED_LANGUAGES = ["en", "hi", "mr"];
export const DEFAULT_LANGUAGE = "en";

export const SARVAM_LANGUAGE_CODES = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  auto: "unknown",
};

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

function getApiKey() {
  return process.env.SARVAM_API_KEY || "";
}

function getBaseUrl() {
  return process.env.SARVAM_BASE_URL || "https://api.sarvam.ai";
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

export function normalizeLanguage(lang, fallback = DEFAULT_LANGUAGE) {
  if (!lang || typeof lang !== "string") return fallback;
  const clean = lang.toLowerCase().trim();
  if (clean === "auto") return "auto";
  return SUPPORTED_LANGUAGES.includes(clean) ? clean : fallback;
}

/**
 * Automatically detects the language (en, hi, mr) of a user prompt or text snippet.
 * Supports Devanagari script (distinguishing Marathi vs Hindi) as well as
 * Romanized Devanagari (Hinglish / Romanized Marathi) and defaults to English.
 */
export function detectLanguage(text) {
  if (!text || typeof text !== "string") return DEFAULT_LANGUAGE;
  const trimmed = text.trim();
  if (!trimmed) return DEFAULT_LANGUAGE;

  // 1. Check for Devanagari Unicode block (\u0900 - \u097F)
  const devanagariMatches = trimmed.match(/[\u0900-\u097F]/g);
  if (devanagariMatches && devanagariMatches.length > 0) {
    // Unique Marathi character: ळ (Devanagari Letter LLA - \u0933)
    if (/[\u0933]/.test(trimmed)) {
      return "mr";
    }

    // Common distinctive Marathi words in Devanagari
    const marathiWords = [
      "आहे", "आहेत", "नाही", "नाहीत", "होते", "होती", "होता", "करावे", "करावा",
      "करावी", "कसा", "कशी", "कसे", "काय", "कशा", "कोण", "केले", "केली", "केला",
      "झाले", "झाला", "झाली", "पाहिजे", "मधे", "मध्ये", "वरून", "यांचा", "त्यांचा",
      "आमचा", "तुमचा", "याच्या", "त्याच्या", "माहिती", "सांगा", "द्या", "येतो",
      "येते", "येतात", "शकतो", "शकते", "शकतात", "म्हणून", "आणि", "किंवा", "असेल",
      "असतील", "असू", "असे", "अशा", "अशी", "असा", "खूप", "फार", "काही", "करायचे",
      "बघायचे", "विचारा", "नको", "लागेल", "करायचं", "करायचा", "चालवायची", "चालवायचा",
      "मशीनवर", "मजला", "लेथवर", "व्हायब्रेशन"
    ];

    // Common distinctive Hindi words in Devanagari
    const hindiWords = [
      "है", "हैं", "था", "थी", "थे", "होगा", "होगी", "होंगे", "करना", "करिए",
      "करें", "करते", "करता", "करती", "किया", "किए", "की", "का", "के", "को",
      "से", "में", "पर", "लिए", "और", "या", "लेकिन", "किन्तु", "परन्तु",
      "क्योंकि", "अगर", "यदि", "तो", "भी", "नहीं", "मत", "क्या", "क्यों",
      "कैसे", "कब", "कहाँ", "कहां", "कौन", "कितना", "कितने", "कितनी", "चाहिए",
      "सकता", "सकती", "सकते", "बताइए", "दीजिए", "होता", "होती", "होते", "मुझे",
      "आपको", "इसका", "उसका", "इनका", "उनका", "रहा", "रही", "रहे", "हुआ", "हुई", "हुए"
    ];

    let marathiScore = 0;
    for (const w of marathiWords) {
      const reg = new RegExp(`(^|[\\s,।!?-])${w}([\\s,।!?-]|$)`, "i");
      if (reg.test(trimmed)) marathiScore += 2;
    }

    let hindiScore = 0;
    for (const w of hindiWords) {
      const reg = new RegExp(`(^|[\\s,।!?-])${w}([\\s,।!?-]|$)`, "i");
      if (reg.test(trimmed)) hindiScore += 2;
    }

    if (marathiScore > hindiScore) return "mr";
    if (hindiScore > marathiScore) return "hi";

    // If balanced or no specific markers matched, check suffixes or default Devanagari to Hindi
    return "hi";
  }

  // 2. Check for Romanized text (Hinglish vs Romanized Marathi)
  const lower = trimmed.toLowerCase();

  const marathiLatinMarkers = [
    "kasa", "kashi", "kase", "karave", "karava", "karavi", "pahije", "madhe",
    "baddal", "mahiti", "sanga", "chalwaycha", "chalwaychi", "karaycha", "karaychi",
    "ahe", "ahet", "kinva", "khup", "tapasaycha", "kiti", "lethvar"
  ];

  const hindiLatinMarkers = [
    "kaise", "kare", "karen", "karein", "karna", "karo", "karega", "karegi",
    "hota", "hoti", "hote", "hai", "hain", "nahin", "kyun", "kyu", "batao",
    "bataye", "batayein", "chahiye", "raha", "rahi", "rahe", "mujhe", "aapko",
    "apko", "mera", "meri", "mere", "iska", "iski", "iske", "lekin", "kripya"
  ];

  let marathiLatinScore = 0;
  for (const m of marathiLatinMarkers) {
    const reg = new RegExp(`\\b${m}\\b`, "i");
    if (reg.test(lower)) marathiLatinScore += 2;
  }

  let hindiLatinScore = 0;
  for (const m of hindiLatinMarkers) {
    const reg = new RegExp(`\\b${m}\\b`, "i");
    if (reg.test(lower)) hindiLatinScore += 2;
  }

  if (marathiLatinScore > hindiLatinScore && marathiLatinScore > 0) return "mr";
  if (hindiLatinScore > marathiLatinScore && hindiLatinScore > 0) return "hi";

  return DEFAULT_LANGUAGE;
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
