"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import VoiceButton from "@/components/agent/VoiceButton";
import LanguageSelector from "@/components/agent/LanguageSelector";
import { IconBrain, IconShield, IconAcoustics, IconExternal } from "@/components/ui/Icons";
import { EXPLORER_URL } from "shared/constants";

const QUICK_PROMPTS = [
  "Chatter on Inconel 718 at 1800 RPM",
  "D2 Die Steel morning thermal expansion offset",
  "Carbide insert notch wear prevention",
  "Titanium blind hole tapping coolant pressure",
];

export default function AgentPage() {
  const [lang, setLang] = useState("en");
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col pt-16 bg-blueprint-grid selection:bg-[#26d464]/30 selection:text-[#ededed]">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Machining Tacit Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1 max-w-xl">
              Multilingual shop-floor consultation powered by Sarvam AI and
              Expendry community knowledge retrieval on MST testnet.
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

          <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
            <span>BM25 INDEX: 10 SEED POSTS · 5 BLUEPRINTS</span>
            <span className="text-white/20">·</span>
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

        {/* Main Workstation Layout (Chat + RAG Grounding Inspector) */}
        <div className="flex-1 min-h-[580px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Interface Viewport */}
          <div className="lg:col-span-8 h-full min-h-[580px] flex flex-col">
            <ChatInterface
              lang={lang}
              externalInput={voiceText}
              onClearExternalInput={() => setVoiceText("")}
              onSourcesUpdated={(sources) => setActiveSources(sources)}
            />
          </div>

          {/* Side RAG Telemetry & Grounding Inspector */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 specular-card">
              <div className="flex items-center justify-between pb-3 border-b border-[#222222] text-xs font-mono">
                <span className="text-[#ededed] font-bold uppercase tracking-wider flex items-center gap-2">
                  <IconShield className="w-4 h-4 text-[#26d464]" />
                  RAG Knowledge Grounding
                </span>
                <span className="text-[#26d464] font-semibold">
                  {activeSources.length > 0 ? `${activeSources.length} Linked` : "Standby"}
                </span>
              </div>

              {activeSources.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-xs text-[#a1a1aa] leading-relaxed">
                    The active response was synthesized using verified machinist insights retrieved from the knowledge ledger:
                  </span>
                  <div className="space-y-2">
                    {activeSources.map((src) => (
                      <div
                        key={src.id}
                        className="p-3 rounded-xl bg-[#0c0c0c] border border-[#262626] space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[#ededed] truncate">
                            {src.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[#26d464] border border-[#2a2a2a] shrink-0">
                            {src.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
                          <span>Author: {src.authorName || "Veteran"}</span>
                          {src.txHash && (
                            <a
                              href={`${EXPLORER_URL}/tx/${src.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#26d464] hover:underline inline-flex items-center gap-1"
                            >
                              <span>MSTScan</span>
                              <IconExternal className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-[#a1a1aa] leading-relaxed">
                  <p>
                    Sarvam AI indexes 10 seed machining setups, 5 CAD blueprints, and community troubleshooting logs.
                  </p>
                  <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-2 font-mono text-[11px]">
                    <div className="text-[#ededed] font-semibold flex items-center gap-1.5">
                      <IconAcoustics className="w-3.5 h-3.5 text-[#26d464]" />
                      Shop-Floor Voice Tip:
                    </div>
                    <div>
                      In noisy CNC toolrooms, mention the exact alloy (e.g. Inconel 718, D2 Die Steel) and cutting tool diameter for sub-micron accuracy.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Multilingual Support Card */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] text-xs font-mono space-y-2">
              <span className="text-[#a1a1aa] block uppercase tracking-wider text-[11px]">
                Language Engine Status:
              </span>
              <div className="flex items-center justify-between text-[#ededed]">
                <span>Active Language:</span>
                <span className="text-[#26d464] font-bold uppercase">
                  {lang === "hi" ? "Hindi (हिन्दी)" : lang === "mr" ? "Marathi (मराठी)" : "English"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#a1a1aa]">
                <span>Voice STT / TTS:</span>
                <span className="text-[#ededed]">Indic Whisper + Sarvam TTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
