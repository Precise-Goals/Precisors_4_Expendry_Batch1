"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import VoiceButton from "@/components/agent/VoiceButton";

const QUICK_PROMPTS = [
  "Chatter on Inconel 718 at 1800 RPM",
  "खराद मशीन पर टूल चयन कैसे करें",
  "लेथवर टूल रनआउट कसा कमी करावा",
  "D2 Die Steel morning thermal expansion offset",
  "Carbide insert notch wear prevention",
];

export default function AgentPage() {
  const [lang, setLang] = useState("auto");
  const [voiceText, setVoiceText] = useState("");
  const [activeSources, setActiveSources] = useState([]);
  const [activePrompt, setActivePrompt] = useState("");

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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-16 bg-blueprint-grid selection:bg-[#26d464]/30 selection:text-white">
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        {/* Operator Console Header & Telemetry */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464] font-semibold">
                Sarvam AI Operator Terminal · v1.4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-montserrat">
              Machining Tacit Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-xl font-poppins">
              Multilingual shop-floor consultation powered by Sarvam AI and
              Expendry community knowledge retrieval.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-[#262626] text-xs font-mono text-[#a1a1aa]">
              <span className="w-2 h-2 rounded-full bg-[#26d464] animate-pulse" />
              <span>AI AUTO-DETECT</span>
            </div>

            <VoiceButton
              lang={lang}
              onTranscript={handleVoiceTranscript}
            />
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626] text-xs font-mono text-[#a1a1aa] specular-card">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#26d464] font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
              SARVAM-105B-CONVERSATIONS
            </span>
            <span className="text-zinc-600">·</span>
            <span>MODEL STATUS: ACTIVE</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#f97316]">LATENCY: ~240ms</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#26d464]">AUTO-DETECT: ACTIVE</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
            <span>BM25 INDEX: 10 SEED POSTS · 5 BLUEPRINTS</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#26d464] font-semibold">RETRIEVAL: OK</span>
          </div>
        </div>

        {/* Quick Diagnostic Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="text-xs font-mono uppercase text-[#a1a1aa] shrink-0 font-semibold">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(prompt)}
              className={`px-3 py-1 rounded-md border text-xs font-mono transition shrink-0 active:scale-98 ${
                activePrompt === prompt
                  ? "bg-[#26d464]/15 border-[#26d464] text-[#26d464] font-bold"
                  : "bg-[#141414] border-[#262626] text-[#a1a1aa] hover:text-[#26d464] hover:border-[#26d464]/50"
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
          />
        </div>
      </div>
    </div>
  );
}
