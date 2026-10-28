"use client";

import { useState, useRef, useEffect } from "react";
import { EXPLORER_URL } from "shared/constants";
import { IconBrain, IconWrench } from "@/components/ui/Icons";

export default function ChatInterface({
  lang = "en",
  onSourcesUpdated,
  externalInput = "",
  onClearExternalInput,
}) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        lang === "hi"
          ? "नमस्ते! मैं सर्वम एआई (Sarvam AI) असिस्टेंट हूँ। खराद, वीएमसी, टूलींग या कटिंग पैरामीटर्स के बारे में आप कोई भी प्रश्न पूछ सकते हैं।"
          : lang === "mr"
          ? "नमस्कार! मी सर्वम एआय (Sarvam AI) असिस्टंट आहे. लेथ, व्हीएमसी, टूलिंग किंवा कटिंग पॅरामीटर्सबद्दल तुम्ही कोणताही प्रश्न विचारू शकता."
          : "Hello! I am your Sarvam AI machining assistant. Ask me anything about lathe operations, VMC milling, tooling selection, or shop-floor setup tips.",
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
          lang,
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
              if (data.done && data.sources) {
                setActiveSources(data.sources);
                if (onSourcesUpdated) onSourcesUpdated(data.sources);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, sources: data.sources }
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
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  lang === "hi"
                    ? "क्षमा करें, प्रतिक्रिया उत्पन्न करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
                    : lang === "mr"
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
    <div className="flex flex-col h-full max-w-4xl mx-auto rounded-2xl border border-[#262626] bg-[#0c0c0c] shadow-2xl overflow-hidden specular-card">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#262626] flex items-center justify-between bg-[#121212]/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-[#26d464] shadow-inner">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#ededed] flex items-center gap-2">
              Sarvam AI Assistant
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/20 font-bold">
                sarvam-105b
              </span>
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              {lang === "hi"
                ? "दुकान-तल मशीनिंग ज्ञानकोश (हिंदी)"
                : lang === "mr"
                ? "दुकान-मजला मशीनिंग ज्ञानकोश (मराठी)"
                : "Shop-floor machining knowledge engine"}
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
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#26d464] text-black font-semibold ml-auto shadow-md"
                      : "bg-[#141414] border border-[#262626] text-[#ededed] shadow-inner specular-card"
                  }`}
                >
                  <div aria-live="polite" aria-atomic="false">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Tactile Blueprint Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#262626] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                        RAG Grounding Sources (MST Verified):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src) => (
                          <div
                            key={src.id}
                            className="p-2 rounded-lg bg-[#0c0c0c] border border-[#262626] text-xs flex flex-col gap-1 max-w-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[#ededed] truncate">
                                {src.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[#26d464] shrink-0 border border-[#2a2a2a]">
                                {src.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a]">
                              <span>By: {src.authorName || "Veteran"}</span>
                              {src.txHash && (
                                <a
                                  href={`${EXPLORER_URL}/tx/${src.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#26d464] hover:underline"
                                >
                                  MST Tx ↗
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
            <span className="italic font-mono text-[11px]">Sarvam AI is synthesizing shop-floor telemetry...</span>
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
          placeholder={
            lang === "hi"
              ? "खराद, मिलिंग, टूलिंग या कटिंग स्पीड के बारे में पूछें..."
              : lang === "mr"
              ? "लेथ, मिलिंग, टूलिंग किंवा कटिंग स्पीडबद्दल विचारा..."
              : "Ask about feeds, lathe chatter, carbide grades, tapping..."
          }
          disabled={isLoading}
          className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-xl px-3.5 py-2.5 text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#26d464] transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#26d464] text-black font-semibold text-sm hover:bg-[#20b855] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-98"
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
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
