import { NextResponse } from "next/server";
import { synthesise, normalizeLanguage } from "@/lib/sarvam";

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

    const { text, lang = "en" } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text string is required for audio synthesis" },
        { status: 400 }
      );
    }

    const resolvedLang = normalizeLanguage(lang);
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey || apiKey.startsWith("test-")) {
      return NextResponse.json({
        success: true,
        audio: "mock-audio-base64-test",
        language: resolvedLang,
      });
    }

    const result = await synthesise(text, resolvedLang);

    return NextResponse.json({
      success: true,
      audio: result.audio,
      language: result.language,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to synthesise audio" },
      { status: 500 }
    );
  }
}
