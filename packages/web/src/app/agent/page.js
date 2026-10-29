"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";

const QUICK_PROMPTS = [
  "Inconel 718 machining chatter at 1800 RPM",
  "खराद मशीन पर सही कटिंग टूल कैसे चुनें?",
  "लेथवर टूल रनआउट कसा कमी करावा?",
  "CoCrMo knee implant 5-axis surface finish Ra 0.02",
  "Carbide insert notch wear prevention in D2 die steel",
];

export default function AgentPage() {
  const [lang] = useState("auto");
  const [activePrompt, setActivePrompt] = useState("");

  const handleQuickPromptClick = (prompt) => {
    setActivePrompt(prompt);
  };

  return (
    <div className="agent-terminal-page min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Clean Architectural Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                Sarvam AI Tacit Assistant
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Machining Tacit Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-poppins">
              Shop-floor consulting powered by Sarvam 105B conversations, Shubh voice synthesis, and real-time community tacit knowledge retrieval.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-zinc-800">Auto-detects: English · हिंदी · मराठी</span>
          </div>
        </div>

        {/* Quick Diagnostic Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="text-xs font-mono uppercase text-zinc-500 shrink-0 font-bold">
            Suggested:
          </span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPromptClick(prompt)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-500 hover:text-emerald-700 text-zinc-700 whitespace-nowrap text-xs transition shadow-2xs cursor-pointer active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Main ChatGPT-Style Conversational Viewport */}
        <div className="flex-1 w-full min-h-[600px] h-[720px] rounded-3xl shadow-xl">
          <ChatInterface
            lang={lang}
            externalInput={activePrompt}
            onClearExternalInput={() => setActivePrompt("")}
          />
        </div>
      </div>
    </div>
  );
}
