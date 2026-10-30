import { NextResponse } from "next/server";
import { synthesise, normalizeLanguage, detectLanguage } from "@/lib/sarvam";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { text, lang, language_code } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text string is required for audio synthesis" },
        { status: 400 }
      );
    }

    const inputLang = lang || language_code || "auto";
    let resolvedLang = normalizeLanguage(inputLang);
    if (resolvedLang === "auto") {
      resolvedLang = detectLanguage(text);
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey || apiKey.startsWith("test-")) {
      return NextResponse.json({
        success: true,
        audio: "mock-audio-base64-test",
        audio_base64: "mock-audio-base64-test",
        language: resolvedLang,
      });
    }

    const result = await synthesise(text, resolvedLang);

    return NextResponse.json({
      success: true,
      audio: result.audio,
      audio_base64: result.audio,
      language: result.language,
    });
  } catch (err) {
    console.error("Audio synthesis error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to synthesise audio" },
      { status: err.status && err.status >= 400 && err.status < 600 ? err.status : 500 }
    );
  }
}
