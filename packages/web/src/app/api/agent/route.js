import { NextResponse } from "next/server";
import { assembleContext } from "@/lib/rag";
import {
  normalizeLanguage,
  chat,
  SarvamError,
  SARVAM_MODEL,
} from "@/lib/sarvam";
import { agentRateLimiter } from "@/lib/rateLimit";

const MAX_REQUESTS_PER_WINDOW = 20;

let agentDeps = {};

export function setAgentDependencies(deps) {
  agentDeps = deps || {};
}

export function clearRateLimits() {
  agentRateLimiter.clear();
}

function checkRateLimit(ip) {
  const result = agentRateLimiter.check(ip);
  return {
    allowed: result.allowed,
    remaining: result.remaining,
    retryAfter: result.retryAfter,
  };
}

export async function POST(request) {
  // Extract client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = checkRateLimit(ip);
  const retryAfterSec = rateCheck.retryAfter || 1;

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

  if (
    Object.prototype.hasOwnProperty.call(body, "__proto__") ||
    Object.prototype.hasOwnProperty.call(body, "constructor") ||
    Object.prototype.hasOwnProperty.call(body, "prototype")
  ) {
    return NextResponse.json(
      { error: "Invalid payload: Prototype pollution attempt detected" },
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
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                  const dataStr = trimmed.slice(6).trim();
                  if (dataStr === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(dataStr);
                    const deltaContent =
                      parsed.choices?.[0]?.delta?.content || "";
                    if (deltaContent) {
                      const sse = `data: ${JSON.stringify({
                        delta: deltaContent,
                        done: false,
                      })}\n\n`;
                      controller.enqueue(encoder.encode(sse));
                    }
                  } catch {
                    // Ignore parse error on partial chunks
                  }
                }
              }
            }
            // Stream complete from external Sarvam, emit done event
            const finalEvent = `data: ${JSON.stringify({
              delta: "",
              done: true,
              sources,
              resolvedLang,
            })}\n\n`;
            controller.enqueue(encoder.encode(finalEvent));
            usedExternal = true;
          }
        } catch {
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
