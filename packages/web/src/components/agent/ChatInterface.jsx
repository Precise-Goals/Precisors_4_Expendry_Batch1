"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { EXPLORER_URL } from "shared/constants";
import { IconBrain, IconWrench, IconBolt, IconExternal, IconSend, IconVolume } from "@/components/ui/Icons";
import { detectLanguage } from "@/lib/language";
import VoiceButton from "./VoiceButton";

const SUGGESTED_PILLS = [
  { label: "Machinist Volunteering & Mentorship", prompt: "How can veteran machinists volunteer their tacit knowledge and mentor apprentices on Expendry?" },
  { label: "CNC Feeds, Speeds & Chatter", prompt: "How do I suppress chatter on Inconel 718 at 1800 RPM on a CNC lathe?" },
  { label: "MST Testnet & EXPEN Token Rewards", prompt: "How do community post rewards and EXPEN token minting work on the MST testnet?" },
  { label: "खराद मशीन टूल चयन (हिंदी)", prompt: "खराद मशीन पर सही कटिंग टूल और फीड रेट कैसे चुनें?" },
  { label: "लेथवर टूल रनआउट नियंत्रण (मराठी)", prompt: "लेथवर टूल रनआउट कसा कमी करावा आणि सरफेस फिनिश कशी सुधारावी?" },
];

export default function ChatInterface({
  lang = "auto",
  onSourcesUpdated,
  externalInput = "",
  onClearExternalInput,
}) {
  const [detectedLang, setDetectedLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Sync external prompt clicks from parent page if provided
  useEffect(() => {
    if (externalInput) {
      handleSendMessage(externalInput);
      if (onClearExternalInput) onClearExternalInput();
    }
  }, [externalInput, onClearExternalInput]);

  // Track manual scrolling to avoid disrupting user reading
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    shouldAutoScrollRef.current = isAtBottom;
  }, []);

  // Smooth auto-scroll during token streaming
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

  const handleSendMessage = async (queryText) => {
    const query = (queryText || input).trim();
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

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    handleSendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput("");
    setActiveSources([]);
  };

  return (
    <div className="flex flex-col h-full w-full rounded-[2.5rem] bg-[#f4f4f6] border border-zinc-200/90 shadow-xl overflow-hidden relative selection:bg-purple-100 selection:text-purple-900 transition-all">
      {/* ──────────────────────────────────────────────────────────
          UPPER APP BAR (Active in conversation mode)
         ────────────────────────────────────────────────────────── */}
      {messages.length > 0 && (
        <div className="px-6 py-3.5 border-b border-zinc-200/80 flex items-center justify-between bg-white/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetChat}
              className="text-lg font-black tracking-tight font-montserrat text-zinc-900 hover:text-purple-700 transition cursor-pointer"
            >
              Expendry AI
            </button>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold">
              105B Tacit RAG
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>English · हिंदी · मराठी</span>
            </div>
            <button
              type="button"
              onClick={handleResetChat}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white transition active:scale-95 shadow-2xs cursor-pointer"
            >
              + New Chat
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MAIN VIEWPORT: EMPTY STATE (CIVIC AI PULSE REFERENCE)
          OR CONVERSATIONAL STREAM VIEW
         ────────────────────────────────────────────────────────── */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center relative">
          <div className="max-w-2xl w-full flex flex-col items-center gap-6 my-auto">
            {/* Monumental Centered Brand Heading (Civic AI style) */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-montserrat text-zinc-950">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#1e1b4b]">
                  Expendry AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-zinc-500 font-bold mt-1">
                Precision Manufacturing &amp; Volunteering Intelligence
              </p>
            </div>

            {/* Pill Suggestions Cluster (Civic AI Pulse Reference Layout) */}
            <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto pt-2">
              {/* Row 1: Two pills */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleSendMessage(SUGGESTED_PILLS[0].prompt)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-zinc-300/90 bg-white/80 hover:bg-white text-zinc-800 text-xs sm:text-sm font-medium transition shadow-xs hover:border-zinc-400 hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  {SUGGESTED_PILLS[0].label}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(SUGGESTED_PILLS[1].prompt)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-zinc-300/90 bg-white/80 hover:bg-white text-zinc-800 text-xs sm:text-sm font-medium transition shadow-xs hover:border-zinc-400 hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  {SUGGESTED_PILLS[1].label}
                </button>
              </div>

              {/* Row 2: One centered pill */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleSendMessage(SUGGESTED_PILLS[2].prompt)}
                  className="px-6 py-2.5 sm:py-3 rounded-full border border-zinc-300/90 bg-white/80 hover:bg-white text-zinc-800 text-xs sm:text-sm font-medium transition shadow-xs hover:border-zinc-400 hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  {SUGGESTED_PILLS[2].label}
                </button>
              </div>

              {/* Multilingual Tacit Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSendMessage(SUGGESTED_PILLS[3].prompt)}
                  className="px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 hover:bg-white text-zinc-600 hover:text-zinc-900 text-xs transition active:scale-95 cursor-pointer"
                >
                  {SUGGESTED_PILLS[3].label}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(SUGGESTED_PILLS[4].prompt)}
                  className="px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 hover:bg-white text-zinc-600 hover:text-zinc-900 text-xs transition active:scale-95 cursor-pointer"
                >
                  {SUGGESTED_PILLS[4].label}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Conversation Feed Viewport */
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2e1065] to-[#6d28d9] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <IconBolt className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                        isUser
                          ? "bg-[#6d28d9] text-white rounded-br-xs shadow-sm font-medium"
                          : "bg-white border border-zinc-200/90 text-zinc-900 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content || (isLoading ? "Thinking..." : "")}</p>
                    </div>

                    {!isUser && msg.content && (
                      <div className="flex flex-wrap items-center gap-2 pl-1 pt-0.5">
                        <button
                          type="button"
                          onClick={() => speakText(msg.content, msg.detectedLang, msg.id)}
                          disabled={speakingMsgId === msg.id}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-purple-700 bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-zinc-200 shadow-2xs transition active:scale-95 cursor-pointer font-mono"
                          aria-label="Read response aloud"
                        >
                          <IconVolume className={`w-3.5 h-3.5 ${speakingMsgId === msg.id ? "text-purple-600 animate-pulse" : ""}`} />
                          <span>{speakingMsgId === msg.id ? "Speaking..." : "Read Voice"}</span>
                        </button>

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {msg.sources.map((src) => (
                              <span
                                key={src.id}
                                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                              >
                                {src.title || src.type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {isLoading && (
            <div className="flex gap-3 items-center text-zinc-500 text-xs max-w-4xl mx-auto pl-11 font-mono">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
              </div>
              <span>Sarvam 105B Tacit Retrieval...</span>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          BOTTOM COMPOSER DOCK (MATCHING REF.PNG EXACTLY)
          Rounded-full capsule, "Ask me anything", purple Send, & Voice button
         ────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 bg-transparent shrink-0">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-4xl w-full mx-auto rounded-full bg-zinc-200/70 hover:bg-zinc-200/90 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-600/10 focus-within:border-purple-600 border border-zinc-300/80 p-2 pl-6 flex items-center gap-2.5 transition-all shadow-sm"
        >
          <label htmlFor="expendry-chat-input" className="sr-only">
            Ask me anything
          </label>
          <input
            id="expendry-chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything"
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-zinc-900 placeholder:text-zinc-500 text-sm sm:text-base focus:outline-none disabled:opacity-50"
          />

          {/* Purple Send Action Button (matching ref.png) */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:hover:bg-[#7c3aed] text-white px-5 sm:px-6 py-2.5 font-medium text-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
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
              <span>Send</span>
            )}
          </button>

          {/* Dedicated Voice Button (matching pencil-annotated Voice button in ref.png!) */}
          <VoiceButton
            variant="pill"
            lang={lang}
            onTranscript={(transcript) => {
              if (transcript) {
                setInput(transcript);
                handleSendMessage(transcript);
              }
            }}
            isStreaming={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
