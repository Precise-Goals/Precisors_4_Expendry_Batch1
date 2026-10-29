"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { EXPLORER_URL } from "shared/constants";
import { IconBrain, IconWrench, IconBolt, IconExternal, IconSend, IconVolume } from "@/components/ui/Icons";
import { detectLanguage } from "@/lib/language";
import VoiceButton from "./VoiceButton";

export default function ChatInterface({
  lang = "auto",
  onSourcesUpdated,
  externalInput = "",
  onClearExternalInput,
}) {
  const [detectedLang, setDetectedLang] = useState("en");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to the Expendry Machining Tacit Assistant. I am grounded in veteran machinist troubleshooting notes, ISO 13485 implant parameters, and Sarvam AI multilingual reasoning.\n\nAsk me anything in English, हिंदी, or मराठी about CNC feed rates, chatter suppression, implant surface finishes, or carbide grades.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Sync external prompt clicks
  useEffect(() => {
    if (externalInput) {
      setInput(externalInput);
      if (onClearExternalInput) onClearExternalInput();
    }
  }, [externalInput, onClearExternalInput]);

  // Track if user is scrolling up to disable aggressive auto-scrolling
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    shouldAutoScrollRef.current = isAtBottom;
  }, []);

  // Smooth & glitch-free auto-scrolling during streaming
  useEffect(() => {
    if (shouldAutoScrollRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
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
    shouldAutoScrollRef.current = true;

    // Placeholder assistant message for token streaming
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
                    : "Sorry, an error occurred while communicating with Sarvam AI. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl border border-zinc-200/90 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Clean Glassmorphic Header */}
      <div className="px-6 py-4 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-emerald-400 shadow-md">
            <IconBolt className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2 font-montserrat tracking-tight">
              Sarvam AI Assistant
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                105B Reasoning
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-poppins">
              {detectedLang === "hi"
                ? "दुकान-तल मशीनिंग ज्ञानकोश (हिंदी) · भाषा स्वतः शोधली जाते"
                : detectedLang === "mr"
                ? "दुकान-मजला मशीनिंग ज्ञानकोश (मराठी) · भाषा आपोआप ओळखली जाते"
                : "Shop-floor machining knowledge engine · English / हिंदी / मराठी"}
            </p>
          </div>
        </div>

        {activeSources.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{activeSources.length} Grounded Source{activeSources.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-white via-zinc-50/30 to-white"
      >
        <ul
          role="log"
          aria-label="Conversation history"
          aria-live="polite"
          aria-atomic="false"
          className="space-y-6 max-w-4xl mx-auto"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <li
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <IconBrain className="w-4 h-4 text-emerald-600" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 sm:px-6 py-4 text-sm sm:text-base leading-relaxed ${
                    isUser
                      ? "bg-zinc-900 text-white font-medium ml-auto shadow-md"
                      : "bg-white border border-zinc-200/90 text-zinc-900 shadow-sm"
                  }`}
                >
                  {!isUser && msg.id !== "welcome" && (
                    <div className="mb-3 flex items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {msg.detectedLang === "hi"
                          ? "हिंदी (HI)"
                          : msg.detectedLang === "mr"
                          ? "मराठी (MR)"
                          : "English (EN)"}
                      </span>

                      {/* Native Sarvam Shubh Audio Playback */}
                      <button
                        type="button"
                        onClick={() => speakText(msg.content, msg.detectedLang, msg.id)}
                        disabled={speakingMsgId === msg.id}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                        title="Listen with Sarvam Shubh Voice"
                      >
                        <IconVolume className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{speakingMsgId === msg.id ? "Speaking..." : "Listen (Shubh)"}</span>
                      </button>
                    </div>
                  )}

                  <div aria-live="polite" aria-atomic="false">
                    <p className="whitespace-pre-wrap leading-relaxed text-pretty">{msg.content}</p>
                    {/* Active streaming cursor indicator */}
                    {isLoading && !isUser && msg.content && (
                      <span className="inline-block w-2 h-4 ml-1.5 bg-emerald-600 animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Grounded Tacit Sources Matrix */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                        Verified Tacit Sources (MST Blockchain):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src) => (
                          <div
                            key={src.id}
                            className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex flex-col gap-1 max-w-sm shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-zinc-900 truncate">
                                {src.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                                {src.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                              <span>Author: {src.authorName || "Veteran Operator"}</span>
                              {src.txHash && (
                                <a
                                  href={`${EXPLORER_URL}/tx/${src.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline inline-flex items-center gap-1 font-bold"
                                >
                                  <span>View Tx</span>
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
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <IconWrench className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Thought / Synthesis Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-zinc-600 text-xs max-w-4xl mx-auto pl-12 font-mono">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
            <span>Sarvam 105B reasoning &amp; knowledge retrieval...</span>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          CHATGPT-STYLE BOTTOM INPUT COMPOSER
          Input box with Send button + Voice Mic button right beside it!
         ────────────────────────────────────────────────────────── */}
      <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-xl border-t border-zinc-200">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-2 bg-zinc-50 border border-zinc-300 rounded-2xl p-1.5 sm:p-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 focus-within:bg-white transition-all shadow-xs"
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
            placeholder="Ask anything in English, हिंदी, or मराठी (e.g. Inconel 718 feeds, lathe chatter, knee implant tolerances)..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50"
          />

          {/* Send Action Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white transition disabled:opacity-30 disabled:hover:bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-xs"
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
          </button>

          {/* Voice Mic Button — Right Next to Send Button (ChatGPT style!) */}
          <VoiceButton
            lang={lang}
            onTranscript={(transcript) => {
              if (transcript) {
                setInput(transcript);
              }
            }}
            isStreaming={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
