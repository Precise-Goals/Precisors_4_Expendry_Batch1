"use client";

import { useState, useRef, useEffect } from "react";
import { EXPLORER_URL } from "shared/constants";
import { IconBrain, IconWrench } from "@/components/ui/Icons";

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
        "Hello! I am your Sarvam AI machining assistant. Ask me anything about lathe operations, VMC milling, tooling selection, or shop-floor setup tips. You can ask in English, हिंदी, or मराठी — I will automatically detect your language and respond in the same language.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
                    : "Sorry, an error occurred while streaming the response. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#262626] bg-[#0c0c0c] shadow-2xl overflow-hidden specular-card">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#262626] flex items-center justify-between bg-[#121212]/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-[#26d464] shadow-inner">
            <IconBolt className="w-4 h-4 text-[#26d464]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#ededed] flex items-center gap-2 font-display">
              Sarvam AI Assistant
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/20 font-bold">
                sarvam-105b
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-[#26d464] border border-neutral-800">
                auto-detect active
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              {detectedLang === "hi"
                ? "दुकान-तल मशीनिंग ज्ञानकोश (हिंदी) · भाषा स्वतः शोधली जाते"
                : detectedLang === "mr"
                ? "दुकान-मजला मशीनिंग ज्ञानकोश (मराठी) · भाषा आपोआप ओळखली जाते"
                : "Shop-floor machining knowledge engine · Auto-detects EN / HI / MR"}
            </p>
          </div>
        </div>

        {activeSources.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#26d464] bg-[#26d464]/10 px-2.5 py-1 rounded-full border border-[#26d464]/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse" />
            <span>{activeSources.length} Verified Source{activeSources.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center shrink-0 shadow-inner">
                    <IconBrain className="w-4 h-4 text-[#26d464]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#26d464] text-[#0a0a0a] font-semibold ml-auto shadow-md"
                      : "bg-[#141414] border border-[#262626] text-[#ededed] shadow-inner specular-card"
                  }`}
                >
                  {!isUser && msg.detectedLang && msg.id !== "welcome" && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#26d464]" />
                        {msg.detectedLang === "hi"
                          ? "हिंदी (HI)"
                          : msg.detectedLang === "mr"
                          ? "मराठी (MR)"
                          : "English (EN)"}
                      </span>
                    </div>
                  )}

                  <div aria-live="polite" aria-atomic="false">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {/* Active streaming cursor */}
                    {isLoading && !isUser && msg.content && (
                      <span className="inline-block w-2 h-4 ml-1 bg-[#26d464] animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Tactile Blueprint Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#262626] space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] block font-semibold">
                        RAG Grounding Sources (MST Verified):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src) => (
                          <div
                            key={src.id}
                            className="p-2.5 rounded-lg bg-[#0c0c0c] border border-[#262626] text-xs flex flex-col gap-1 max-w-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[#ededed] truncate">
                                {src.title}
                              </span>
                              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[#26d464] shrink-0 border border-[#2a2a2a]">
                                {src.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
                              <span>By: {src.authorName || "Veteran"}</span>
                              {src.txHash && (
                                <a
                                  href={`${EXPLORER_URL}/tx/${src.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#26d464] hover:underline inline-flex items-center gap-1"
                                >
                                  <span>MST Tx</span>
                                  <IconExternal className="w-3 h-3 text-[#26d464]" />
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
                  <div className="w-8 h-8 rounded-lg bg-[#26d464] flex items-center justify-center shrink-0 shadow-inner">
                    <IconWrench className="w-4 h-4 text-black" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-[#a1a1aa] text-xs pl-11">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-pulse [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-pulse [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-pulse"></span>
            </div>
            <span className="italic font-mono text-xs text-[#a1a1aa]">Sarvam AI is synthesizing shop-floor telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 border-t border-[#262626] bg-[#121212]/90 flex gap-2 items-center"
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
          placeholder="Ask in English, हिंदी, or मराठी (e.g. feeds, lathe chatter, carbide grades)..."
          disabled={isLoading}
          className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-[#ededed] placeholder-[#a1a1aa]/70 focus:outline-none focus:border-[#26d464] transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-md bg-[#26d464] text-black font-semibold text-xs sm:text-sm hover:bg-[#20b855] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-98"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 animate-spin"
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
            <IconSend className="w-4 h-4 text-black" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
