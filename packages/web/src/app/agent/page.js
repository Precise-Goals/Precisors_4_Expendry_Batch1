"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import VoiceButton from "@/components/agent/VoiceButton";
import LanguageSelector from "@/components/agent/LanguageSelector";

const QUICK_PROMPTS = [
  "Chatter on Inconel 718 at 1800 RPM",
  "D2 Die Steel morning thermal expansion offset",
  "Carbide insert notch wear prevention",
  "Titanium blind hole tapping coolant pressure",
];

export default function AgentPage() {
  const [lang, setLang] = useState("en");
  const [voiceText, setVoiceText] = useState("");
  const [, setActiveSources] = useState([]);

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      setVoiceText(transcript);
    }
  };

  const handleQuickPromptClick = (prompt) => {
    setVoiceText(prompt);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col pt-16 bg-blueprint-grid">
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
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-xl">
              Multilingual shop-floor consultation powered by Sarvam AI and
              Expendry community knowledge retrieval.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LanguageSelector
              currentLang={lang}
              onLanguageChange={(newLang) => setLang(newLang)}
            />

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
            <span className="text-white/20">·</span>
            <span>MODEL STATUS: ACTIVE</span>
            <span className="text-white/20">·</span>
            <span className="text-[#ededed]">LATENCY: ~240ms</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
            <span>BM25 INDEX: 10 SEED POSTS · 5 BLUEPRINTS</span>
            <span className="text-white/20">·</span>
            <span className="text-[#26d464] font-semibold">RETRIEVAL: OK</span>
          </div>
        </div>

        {/* Quick Diagnostic Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="text-[11px] font-mono uppercase text-[#71717a] shrink-0">
            Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(prompt)}
              className="px-3 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs text-[#a1a1aa] hover:text-[#26d464] hover:border-[#26d464]/50 transition shrink-0 font-mono active:scale-98"
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
