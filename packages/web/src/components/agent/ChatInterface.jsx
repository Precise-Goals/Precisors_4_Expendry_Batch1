"use client";

import { useState, useRef, useEffect } from "react";
import { EXPLORER_URL } from "shared/constants";
import { IconBrain, IconWrench, IconBolt, IconExternal, IconSend } from "@/components/ui/Icons";
import { detectLanguage } from "@/lib/language";

export default function ChatInterface({
  lang = "auto",
  onSourcesUpdated,
  externalInput = "",
  onClearExternalInput,
  isCallMode = false,
  onToggleCallMode,
}) {
  const [detectedLang, setDetectedLang] = useState("en");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your Sarvam AI machining & precision manufacturing assistant. Ask me anything about CNC lathe turning, 5-axis implant milling, tooling selection, or shop-floor tolerances. You can ask in English, हिंदी, or मराठी — I will automatically detect your language and respond in the same language with Shubh native voice.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (externalInput) {
      const timer = setTimeout(() => {
        setInput(externalInput);
        if (onClearExternalInput) onClearExternalInput();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [externalInput, onClearExternalInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const speakText = async (text, msgLang, msgId) => {
    if (!text || !text.trim()) return;
    setSpeakingMsgId(msgId);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const res = await fetch("/api/agent/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: msgLang || "en" }),
      });

      if (!res.ok) throw new Error("Synthesis failed");
      const data = await res.json();

      if (data.audio && data.audio !== "mock-audio-base64-test") {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onended = () => setSpeakingMsgId(null);
        audio.onerror = () => setSpeakingMsgId(null);
        await audio.play();
      } else {
        setSpeakingMsgId(null);
      }
    } catch {
      setSpeakingMsgId(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    const userMessageId = `msg_${Date.now()}`;
    const assistantMessageId = `msg_${Date.now() + 1}`;

    const newMessages = [
      ...messages,
      { id: userMessageId, role: "user", content: query },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Placeholder assistant message for streaming tokens
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "", sources: [] },
    ]);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          lang: "auto",
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamBuffer = "";
      let accumulatedContent = "";
      let finalResolvedLang = "en";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n\n");
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.delta) {
                accumulatedContent += data.delta;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
              if (data.done) {
                if (data.sources) {
                  setActiveSources(data.sources);
                  if (onSourcesUpdated) onSourcesUpdated(data.sources);
                }
                if (data.resolvedLang) {
                  finalResolvedLang = data.resolvedLang;
                  setDetectedLang(data.resolvedLang);
                }
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          sources: data.sources || msg.sources,
                          detectedLang: data.resolvedLang,
                        }
                      : msg
                  )
                );

                // Auto-speak in Live Call Mode
                if (isCallMode && accumulatedContent) {
                  speakText(accumulatedContent, finalResolvedLang, assistantMessageId);
                }
              }
            } catch {
              // Ignore parse errors on malformed event lines
            }
          }
        }
      }
    } catch {
      const detectedQueryLang = detectLanguage(query);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  detectedQueryLang === "hi"
                    ? "क्षमा करें, प्रतिक्रिया उत्पन्न करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
                    : detectedQueryLang === "mr"
                    ? "क्षमस्व, प्रतिसाद तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
                    : "Sorry, an error occurred while streaming the response from Sarvam AI. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-400 shadow-sm">
            <IconBolt className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 font-montserrat">
              Sarvam AI Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                sarvam-105b
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                Shubh Voice
              </span>
            </h2>
            <p className="text-xs text-zinc-500">
              {detectedLang === "hi"
                ? "दुकान-तल मशीनिंग ज्ञानकोश (हिंदी) · भाषा स्वतः शोधली जाते"
                : detectedLang === "mr"
                ? "दुकान-मजला मशीनिंग ज्ञानकोश (मराठी) · भाषा आपोआप ओळखली जाते"
                : "Shop-floor machining tacit engine · Auto-detects EN / HI / MR"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onToggleCallMode && (
            <button
              type="button"
              onClick={onToggleCallMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                isCallMode
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCallMode ? "bg-white animate-pulse" : "bg-zinc-400"}`} />
              <span>{isCallMode ? "Call Mode: ON" : "Call Mode: OFF"}</span>
            </button>
          )}

          {activeSources.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeSources.length} Verified Source{activeSources.length > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
        <ul
          role="log"
          aria-label="Conversation history"
          aria-live="polite"
          aria-atomic="false"
          className="space-y-4"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <li
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                    <IconBrain className="w-4 h-4 text-emerald-600" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-zinc-900 text-white font-medium ml-auto shadow-sm"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-900 shadow-sm"
                  }`}
                >
                  {!isUser && msg.detectedLang && msg.id !== "welcome" && (
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 font-bold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {msg.detectedLang === "hi"
                          ? "हिंदी (HI)"
                          : msg.detectedLang === "mr"
                          ? "मराठी (MR)"
                          : "English (EN)"}
                      </span>

                      {/* Listen audio button */}
                      <button
                        type="button"
                        onClick={() => speakText(msg.content, msg.detectedLang, msg.id)}
                        disabled={speakingMsgId === msg.id}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                        title="Listen using Sarvam Shubh Native Voice"
                      >
                        <span>{speakingMsgId === msg.id ? "🔊 Speaking..." : "▶ Listen (Shubh)"}</span>
                      </button>
                    </div>
                  )}

                  <div aria-live="polite" aria-atomic="false">
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {/* Active streaming cursor */}
                    {isLoading && !isUser && msg.content && (
                      <span className="inline-block w-2 h-4 ml-1 bg-emerald-600 animate-pulse align-middle" />
                    )}
                  </div>

                  {/* RAG Grounding Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-200 space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                        RAG Grounding Sources (MST Verified):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src) => (
                          <div
                            key={src.id}
                            className="p-2.5 rounded-xl bg-white border border-zinc-200 text-xs flex flex-col gap-1 max-w-sm shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-zinc-900 truncate">
                                {src.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-emerald-700 shrink-0 border border-zinc-200">
                                {src.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                              <span>By: {src.authorName || "Veteran"}</span>
                              {src.txHash && (
                                <a
                                  href={`${EXPLORER_URL}/tx/${src.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-semibold"
                                >
                                  <span>MST Tx</span>
                                  <IconExternal className="w-3 h-3 text-emerald-600" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                    <IconWrench className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-zinc-500 text-xs pl-11">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
            <span className="italic font-mono text-xs text-zinc-500">Sarvam AI is synthesizing shop-floor telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-200 bg-zinc-50 flex gap-2 items-center"
      >
        <label htmlFor="agent-chat-input" className="sr-only">
          Ask machining question
        </label>
        <input
          id="agent-chat-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask in English, हिंदी, or मराठी (e.g. Inconel 718 feeds, lathe chatter, knee implant tolerance)..."
          disabled={isLoading}
          className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <IconSend className="w-4 h-4 text-white" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
