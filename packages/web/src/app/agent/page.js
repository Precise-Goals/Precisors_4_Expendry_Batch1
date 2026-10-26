"use client";

import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import VoiceButton from "@/components/agent/VoiceButton";
import LanguageSelector from "@/components/agent/LanguageSelector";

export default function AgentPage() {
  const [lang, setLang] = useState("en");
  const [voiceText, setVoiceText] = useState("");
  const [activeSources, setActiveSources] = useState([]);

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      setVoiceText(transcript);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col pt-16">
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464]">
                Sarvam AI Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-montserrat">
              Machining Tacit Assistant
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
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

        {/* RAG Knowledge Attribution Banner */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#26d464]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>
              <strong className="text-neutral-200">RAG Context:</strong> BM25-lite
              synthesizes veteran blueprints and setup tips from Firestore into prompt context.
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#26d464]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26d464]"></span>
            Active
          </span>
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
