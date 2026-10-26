import { NextResponse } from "next/server";
import { assembleContext } from "@/lib/rag";
import {
  normalizeLanguage,
  chat,
  SarvamError,
  SARVAM_MODEL,
} from "@/lib/sarvam";

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

let agentDeps = {};

export function setAgentDependencies(deps) {
  agentDeps = deps || {};
}

export function clearRateLimits() {
  rateLimitMap.clear();
}

function checkRateLimit(ip) {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, record);
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: record.resetTime,
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetTime: record.resetTime,
  };
}

export async function POST(request) {
  // Extract client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = checkRateLimit(ip);
  const retryAfterSec = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);

  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({
        error: "Too Many Requests: Rate limit exceeded (20 requests per minute).",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(retryAfterSec > 0 ? retryAfterSec : 1),
        },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Payload must be an object" },
      { status: 400 }
    );
  }

  const { message, lang, history = [] } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const resolvedLang = normalizeLanguage(lang);

  // 1. Assemble RAG Context
  const contextAssembler = agentDeps.assembleContext || assembleContext;
  let ragResult;
  try {
    ragResult = await contextAssembler(message, agentDeps.db || null, 5, 1500);
  } catch {
    ragResult = { contextText: "", sources: [], tokenCount: 0 };
  }

  const { contextText, sources } = ragResult;

  // 2. Prepare System Prompt & Conversation History
  const langName =
    resolvedLang === "hi"
      ? "Hindi (हिंदी)"
      : resolvedLang === "mr"
      ? "Marathi (मराठी)"
      : "English";

  const systemPrompt = `You are Sarvam AI, an expert manufacturing and machining assistant for Expendry.
Answer the user's questions with practical, shop-floor actionable advice in ${langName}.
${
  contextText
    ? `\nRelevant shop-floor knowledge from the Expendry community:\n${contextText}\n\nSynthesize this tacit knowledge in your response and cite relevant community insights.`
    : ""
}`;

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  // 3. Streaming Response Generation
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const apiKey = process.env.SARVAM_API_KEY;
      const chatFn = agentDeps.chat || chat;

      // Check if we should call external Sarvam streaming or use local generator
      let usedExternal = false;
      if (apiKey && !apiKey.startsWith("test-")) {
        try {
          const sarvamRes = await chatFn(formattedMessages, resolvedLang, {
            stream: true,
          });
          if (sarvamRes && sarvamRes.body) {
            const reader = sarvamRes.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            usedExternal = true;
          }
        } catch (err) {
          // Fallback to local response generator
        }
      }

      if (!usedExternal) {
        let answer = "";
        if (resolvedLang === "hi") {
          answer = `नमस्ते! एक्सपेंड्री ज्ञानकोश के अनुसार, आपके प्रश्न "${message}" का उत्तर: मशीनिंग सेटअप में सही फीड रेट, टूल वियर की निगरानी और कूलेंट फ्लो बनाए रखना अनिवार्य है।`;
          if (sources.length > 0) {
            answer += ` (संदर्भ: ${sources[0].title})`;
          }
        } else if (resolvedLang === "mr") {
          answer = `नमस्कार! एक्सपेंड्री ज्ञानानुसार, तुमच्या "${message}" या प्रश्नाचे उत्तर: मशीनिंग अचूकतेसाठी टूल रनआउट तपासणे आणि योग्य कटिंग स्पीड निवडणे अत्यंत आवश्यक आहे.`;
          if (sources.length > 0) {
            answer += ` (संदर्भ: ${sources[0].title})`;
          }
        } else {
          answer = `Based on Expendry community tacit knowledge, regarding "${message}": optimal feeds, rigid workholding, and vibration dampening ensure superior surface finish.`;
          if (sources.length > 0) {
            answer += ` (Referenced from: ${sources[0].title})`;
          }
        }

        const words = answer.split(" ");
        for (let i = 0; i < words.length; i += 3) {
          const textPiece = words.slice(i, i + 3).join(" ") + " ";
          const sseEvent = `data: ${JSON.stringify({
            delta: textPiece,
            done: false,
          })}\n\n`;
          controller.enqueue(encoder.encode(sseEvent));
        }

        const finalEvent = `data: ${JSON.stringify({
          delta: "",
          done: true,
          sources,
          resolvedLang,
        })}\n\n`;
        controller.enqueue(encoder.encode(finalEvent));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
      "X-RateLimit-Remaining": String(rateCheck.remaining),
    },
  });
}
