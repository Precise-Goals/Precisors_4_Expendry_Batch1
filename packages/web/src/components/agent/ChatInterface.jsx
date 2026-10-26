"use client";

import { useState, useRef, useEffect } from "react";

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
      let responseSources = [];

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
                responseSources = data.sources;
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
    } catch (err) {
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
    <div className="flex flex-col h-full max-w-4xl mx-auto rounded-xl border border-neutral-800 bg-[#0d0d0d] shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#26d464]/10 border border-[#26d464]/30 flex items-center justify-center text-[#26d464]">
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
            <h2 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
              Sarvam AI Assistant
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/20">
                sarvam-105b
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {lang === "hi"
                ? "दुकान-तल मशीनिंग ज्ञानकोश (हिंदी)"
                : lang === "mr"
                ? "दुकान-मजला मशीनिंग ज्ञानकोश (मराठी)"
                : "Shop-floor machining knowledge engine"}
            </p>
          </div>
        </div>

        {activeSources.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#26d464] bg-[#26d464]/10 px-2.5 py-1 rounded-full border border-[#26d464]/20">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{activeSources.length} Community Source{activeSources.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Messages viewport */}
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
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-[#26d464]">
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
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#26d464] text-neutral-950 font-medium ml-auto"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Sources pills */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                      <span className="text-[11px] text-neutral-400 mr-1">
                        Knowledge from community:
                      </span>
                      {msg.sources.map((src) => (
                        <span
                          key={src.id}
                          className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-[#26d464] border border-neutral-700"
                        >
                          {src.title} ({src.type})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#26d464]/20 border border-[#26d464]/40 flex items-center justify-center shrink-0 text-[#26d464]">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-neutral-400 text-xs pl-11">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-bounce"></span>
            </div>
            <span className="italic">Sarvam AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 border-t border-neutral-800 bg-neutral-900/50 flex gap-2 items-center"
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
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#26d464] transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-lg bg-[#26d464] text-neutral-950 font-semibold text-sm hover:bg-[#20b855] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
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
