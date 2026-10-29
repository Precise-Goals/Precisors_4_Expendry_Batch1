"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconSpindle,
  IconBrain,
  IconToken,
  IconBlueprint,
  IconShield,
  IconCaliper,
  IconCheck,
  IconArrowRight,
  IconLathe,
  IconAcoustics,
  IconFactory,
} from "@/components/ui/Icons";
import { CHAIN_ID, REWARD_PER_POST, DAILY_CAP } from "shared/constants";

const TIMELINE_EVENTS = [
  {
    year: "1984",
    title: "Manual Toolroom Era",
    tag: "Analog Foundation",
    description:
      "Hand-turned lead screws, vernier calipers, and shop-floor wisdom locked in physical machinists' notebooks. Troubleshooting chatter was learned through 15 years of ear-tuning.",
  },
  {
    year: "2005",
    title: "First-Wave CNC & G-Code",
    tag: "Digital Execution",
    description:
      "High-speed machining and CAM programming revolutionized throughput. Yet the tacit secrets—thermal offsets, fixture dampening, and coolant tricks—remained unindexed tribal knowledge.",
  },
  {
    year: "2020",
    title: "The Demographic Cliff",
    tag: "Global Crisis",
    description:
      "Over 2.7 million veteran operators worldwide reach retirement age. Machine shops face acute knowledge drain as decades of tactile intuition vanish off the factory floor.",
  },
  {
    year: "2026",
    title: "Expendry Protocol",
    tag: "Tacit Tokenization",
    description:
      "Decentralized knowledge ledger on MST testnet paired with Sarvam AI multilingual RAG. Veteran machinists tokenize hard-won setup wisdom, mint EXPEN tokens, and preserve precision craft.",
  },
];

const CORE_PILLARS = [
  {
    icon: IconToken,
    title: "Experience as an Economic Asset",
    desc: "Machinist intuition is durable intellectual property. We transform setup tips, chatter dampening methods, and custom fixturing into permanent on-chain records with automated EXPEN rewards.",
  },
  {
    icon: IconBrain,
    title: "Sarvam AI Multilingual RAG",
    desc: "Shop floors speak Hindi, Marathi, and regional dialects. Our Sarvam 105B model processes voice notes from greasy hands and retrieves authentic veteran setups in milliseconds.",
  },
  {
    icon: IconBlueprint,
    title: "Immutable Blueprint Provenance",
    desc: "Technical drawings, GD&T callouts, and custom tooling fixtures receive cryptographic timestamping on MST testnet, establishing undeniable prior art and attribution.",
  },
  {
    icon: IconShield,
    title: "Peer-Verified Shop Floor Truth",
    desc: "Zero generic AI hallucinations. Every recommendation in the Expendry repository originates from proven machine runs, real spindle times, and verified metal removal rates.",
  },
];

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeEra, setActiveEra] = useState(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#26d464]/30 selection:text-[#ededed] bg-blueprint-grid">
      {/* ──────────────────────────────────────────────────────────
          1. HERO: The Vanishing Art of Tacit Manufacturing
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="About Hero"
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#1f1f1f]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">+ [MANIFESTO // 01]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">+ [MST-{CHAIN_ID}]</div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Expendry Protocol Manifesto</span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-[#26d464]">Where Experience Never Retires</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.15]"
          >
            Preserving the Tacit Soul of the Machine Shop
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl"
          >
            Across CNC machine shops, toolrooms, and aerospace fabrication facilities worldwide,
            a quiet crisis is underway. An estimated 2.7 million veteran machinists will retire
            over the next decade. When they switch off their spindles, 40 years of vibration
            intuition, custom jigs, thermal compensation offsets, and sound diagnostics walk out the door.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-[#ededed] leading-relaxed max-w-3xl font-medium"
          >
            Expendry is built on a single uncompromising thesis: <span className="text-[#26d464]">shop-floor experience is a high-value economic asset.</span> By combining gasless on-chain rewards on MST testnet with multilingual Sarvam AI intelligence, we ensure veteran knowledge is permanently preserved, properly compensated, and immediately actionable for the next generation.
          </motion.p>

          {/* Telemetry Indicator Row */}
          <motion.div
            variants={itemVariants}
            className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono"
          >
            <div className="p-3 rounded-xl bg-[#121212] border border-[#262626]">
              <div className="text-[#a1a1aa] text-[10px] uppercase">Retirement Wave</div>
              <div className="text-lg font-bold text-[#ededed] mt-0.5">2.7M Operators</div>
              <div className="text-[10px] text-amber-400 mt-0.5">Global Attrition</div>
            </div>
            <div className="p-3 rounded-xl bg-[#121212] border border-[#262626]">
              <div className="text-[#a1a1aa] text-[10px] uppercase">Reward / Valid Post</div>
              <div className="text-lg font-bold text-[#26d464] mt-0.5">{REWARD_PER_POST} EXPEN</div>
              <div className="text-[10px] text-[#a1a1aa] mt-0.5">Instant On-Chain Mint</div>
            </div>
            <div className="p-3 rounded-xl bg-[#121212] border border-[#262626]">
              <div className="text-[#a1a1aa] text-[10px] uppercase">Daily Wallet Cap</div>
              <div className="text-lg font-bold text-[#ededed] mt-0.5">{DAILY_CAP} EXPEN</div>
              <div className="text-[10px] text-[#a1a1aa] mt-0.5">Sybil-Resistant Limit</div>
            </div>
            <div className="p-3 rounded-xl bg-[#121212] border border-[#262626]">
              <div className="text-[#a1a1aa] text-[10px] uppercase">AI Model</div>
              <div className="text-lg font-bold text-[#ededed] mt-0.5">Sarvam 105B</div>
              <div className="text-[10px] text-[#26d464] mt-0.5">EN · HI · MR Multilingual</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. THE PROBLEM: Why Corporate Wikis Failed the Shop Floor
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="The Problem"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0c0c0c]/60"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Why Corporate Wikis and ERPs Failed the Shop Floor
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
              Standard software companies attempt to document manufacturing with sterile SOPs and keyboard-heavy form fields. But real machine shops do not run on typing behind desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                <IconAcoustics className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#ededed] font-display">
                Tacit Intuition Cannot Be Typed
              </h3>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                A machinist knows a cutter is dull not by measuring hours, but by the pitch of the spindle screech and the blue tint of curling chips. Expendry incorporates audio-first logs and spectrogram diagnostics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                <IconFactory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#ededed] font-display">
                Zero Incentive to Share Secrets
              </h3>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                In traditional factories, veteran tricks are guarded for job security. Expendry flips this game theory: contributors earn liquid EXPEN tokens and permanent on-chain credit for every validated setup shared.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                <IconBrain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#ededed] font-display">
                The Language Barrier
              </h3>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                Global manufacturing clusters operate in native mother tongues. In India, toolmakers converse in Hindi and Marathi vernacular. Sarvam AI provides native acoustic understanding without translating out the nuances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. DUAL-CORE ARCHITECTURE
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Architecture"
        className="py-16 sm:py-24 border-b border-[#1f1f1f]"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              The Dual-Engine Technology Stack
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
              Expendry is engineered as a high-reliability bridge between blockchain immutability and cutting-edge industrial language intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Engine 1: MST Blockchain */}
            <div className="p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#26d464] font-semibold">
                  Core Engine 01
                </span>
                <Badge variant="accent" size="sm">
                  MST Testnet
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#ededed] font-display">
                  MST Blockchain & EXPEN Tokenomics
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed">
                  Every knowledge contribution, blueprint release, and patent registration is verified cryptographically via EIP-191 signatures and stamped onto MST Testnet.
                </p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#ededed] font-mono">
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Gasless operator minting with non-custodial wallet auth</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Strict daily cap (50 EXPEN/day) enforcing high signal-to-noise</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>EIP-191 personal_sign cryptographic verification</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Permanent prior art timestamping for custom fixtures</span>
                </li>
              </ul>
            </div>

            {/* Engine 2: Sarvam AI Multilingual RAG */}
            <div className="p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#26d464] font-semibold">
                  Core Engine 02
                </span>
                <Badge variant="neutral" size="sm">
                  Sarvam 105B
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#ededed] font-display">
                  Sarvam AI Multilingual Grounding
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed">
                  Real-time Retrieval-Augmented Generation that searches only verified machinist posts and blueprint archives to answer tough tooling challenges.
                </p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#ededed] font-mono">
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Indic language voice transcription (Hindi, Marathi, English)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Deterministic BM25 matching across machining tips & blueprints</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Live citations attributing every answer to original machinists</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#26d464] shrink-0 mt-0.5" />
                  <span>Zero hallucination guardrails grounded strictly in verified feeds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. INTERACTIVE TIMELINE: The Evolution of Machinist Craft
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Timeline"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0c0c0c]/60"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Four Decades of Toolroom Evolution
            </h2>
            <p className="text-sm text-[#a1a1aa]">
              Click across the milestones to see how machinist craft transitioned from manual lead-screws to on-chain tacit intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-[#262626] pb-3">
            {TIMELINE_EVENTS.map((event, idx) => (
              <button
                key={event.year}
                type="button"
                onClick={() => setActiveEra(idx)}
                className={`text-left p-3 rounded-xl border transition text-xs font-mono ${
                  activeEra === idx
                    ? "bg-[#181818] border-[#26d464] text-[#ededed] shadow-sm"
                    : "bg-[#121212] border-[#262626] text-[#71717a] hover:text-[#a1a1aa]"
                }`}
              >
                <div className="text-base font-bold font-display text-[#26d464]">
                  {event.year}
                </div>
                <div className="font-semibold truncate mt-0.5">{event.title}</div>
              </button>
            ))}
          </div>

          {/* Active Era Spotlight Card */}
          <div className="p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#26d464] font-bold">
                [ERA {TIMELINE_EVENTS[activeEra].year} {"//"} {TIMELINE_EVENTS[activeEra].tag}]
              </span>
              <span className="text-xs font-mono text-[#a1a1aa]">
                Milestone 0{activeEra + 1} of 04
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#ededed] font-display">
              {TIMELINE_EVENTS[activeEra].title}
            </h3>
            <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed max-w-3xl">
              {TIMELINE_EVENTS[activeEra].description}
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. CORE PILLARS
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Core Pillars"
        className="py-16 sm:py-24 border-b border-[#1f1f1f]"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              The Four Pillars of Expendry
            </h2>
            <p className="text-sm text-[#a1a1aa]">
              Every line of code and smart contract rule in our ecosystem reinforces these commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CORE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. CALL TO ACTION DOCK
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Get Started CTA"
        className="py-16 sm:py-24 bg-[#080808]"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#ededed] font-display">
            Join the Toolroom Renaissance
          </h2>
          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto leading-relaxed">
            Whether you are a 30-year veteran operator with blueprints in your head, or a manufacturer looking to safeguard your factory intuition, Expendry welcomes you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/experience">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Explore Experience Hub</span>
                <span className="ml-2 font-mono">→</span>
              </Button>
            </Link>
            <Link href="/agent">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <span>Consult Sarvam AI Agent</span>
              </Button>
            </Link>
            <Link href="/partners">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-[#26d464]">
                <span>Partner Program</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
