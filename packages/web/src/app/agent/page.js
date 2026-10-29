"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import VoiceButton from "@/components/agent/VoiceButton";

const QUICK_PROMPTS = [
  "Inconel 718 machining chatter at 1800 RPM",
  "खराद मशीन पर सही कटिंग टूल कैसे चुनें?",
  "लेथवर टूल रनआउट कसा कमी करावा?",
  "CoCrMo knee implant 5-axis surface finish Ra 0.02",
  "Carbide insert notch wear prevention in D2 die steel",
];

export default function AgentPage() {
  const [lang] = useState("auto");
  const [voiceText, setVoiceText] = useState("");
  const [activeSources, setActiveSources] = useState([]);
  const [activePrompt, setActivePrompt] = useState("");
  const [isCallMode, setIsCallMode] = useState(false);

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      setVoiceText(transcript);
    }
  };

  const handleQuickPromptClick = (prompt) => {
    setActivePrompt(prompt);
    setVoiceText(prompt);
  };

  return (
    <div className="agent-terminal-page min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Operator Console Header & Telemetry */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                Sarvam AI Operator Terminal · v1.5
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Machining Tacit Assistant
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl font-poppins">
              Multilingual shop-floor consultation powered by Sarvam AI, Shubh speech synthesis,
              and Expendry community tacit knowledge retrieval.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCallMode((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow-xs cursor-pointer ${
                isCallMode
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCallMode ? "bg-white animate-pulse" : "bg-zinc-400"}`} />
              <span>{isCallMode ? "Call Mode: Active" : "Enable Call Mode"}</span>
            </button>

            <VoiceButton
              lang={lang}
              onTranscript={handleVoiceTranscript}
            />
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-600 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              SARVAM-105B-CONVERSATIONS
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-800 font-semibold">VOICE: SHUBH (BULBUL-V3)</span>
            <span className="text-zinc-300">·</span>
            <span className="text-sky-700 font-semibold">STREAMING: SSE REALTIME</span>
            <span className="text-zinc-300">·</span>
            <span className="text-emerald-700 font-semibold">AUTO-DETECT: EN/HI/MR</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>BM25 TACIT INDEX: ACTIVE</span>
            <span className="text-zinc-300">·</span>
            <span className="text-emerald-700 font-bold">RAG: OK</span>
          </div>
        </div>

        {/* Quick Diagnostic Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="text-xs font-mono uppercase text-zinc-500 shrink-0 font-bold">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(prompt)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition shrink-0 active:scale-95 cursor-pointer ${
                activePrompt === prompt
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                  : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
              }`}
            >
              [{prompt}]
            </button>
          ))}
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 min-h-[580px] flex flex-col">
          <ChatInterface
            lang={lang}
            externalInput={voiceText}
            onClearExternalInput={() => setVoiceText("")}
            onSourcesUpdated={(sources) => setActiveSources(sources)}
            isCallMode={isCallMode}
            onToggleCallMode={() => setIsCallMode((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}
