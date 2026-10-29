"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  IconAcoustics,
  IconLathe,
  IconToken,
  IconBrain,
  IconCube3D,
  IconBlueprint,
  IconWrench,
  IconCaliper,
  IconBolt,
  IconClamp,
  IconThermal,
  IconAlert,
  IconCheck,
  IconArrowRight,
  IconShield,
  IconFactory,
  IconTrendingUp,
  IconPlay,
  IconPause,
} from "@/components/ui/Icons";
import { CHAIN_ID, EXPLORER_URL, DAILY_CAP, REWARD_PER_POST } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";
import MagneticTrack from "@/components/ui/MagneticTrack";

const SPINDLE_PRESETS = [
  { name: "Inconel 718", rpm: 1800, feed: "0.12 mm/rev", temp: "420°C", load: "78%" },
  { name: "AISI 4140 Prehard", rpm: 2400, feed: "0.18 mm/rev", temp: "360°C", load: "64%" },
  { name: "Alloy Steel D2", rpm: 1200, feed: "0.08 mm/rev", temp: "290°C", load: "82%" },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [analyzingFlutter, setAnalyzingFlutter] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [calculatorPosts, setCalculatorPosts] = useState(3);
  const [copied, setCopied] = useState(false);
  const [playingAudioSnippet, setPlayingAudioSnippet] = useState(false);

  const activePreset = SPINDLE_PRESETS[activePresetIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(EXPEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculatedDaily = Math.min(calculatorPosts * REWARD_PER_POST, DAILY_CAP);
  const calculatedMonthly = calculatedDaily * 30;
  const calculatedUsd = (calculatedMonthly * 0.5).toFixed(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] relative selection:bg-[#26d464]/30 selection:text-[#ededed]">
      {/* ──────────────────────────────────────────────────────────
          1. HERO SECTION (High-Fidelity Engineering Workstation)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero Section"
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#1f1f1f] bg-blueprint-grid"
      >
        {/* Subtle Corner Engineering Crosshairs & Datums */}
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[11px] font-mono text-white/30">+ [00,00] DATUM</div>
          <div className="absolute top-4 right-4 text-[11px] font-mono text-white/30">+ [MST-{CHAIN_ID}]</div>
          <div className="absolute bottom-4 left-4 text-[11px] font-mono text-white/25">[REF: 18.5204°N, 73.8567°E]</div>
          <div className="absolute bottom-4 right-4 text-[11px] font-mono text-white/25">+ [ISO-2768-mK]</div>
        </div>

        {/* Ambient Subtle Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[380px] bg-[#26d464]/8 blur-[150px] rounded-full"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Protocol Status Beacon */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#121212] border border-[#262626] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#26d464]" />
              <span className="text-xs font-mono font-medium text-[#ededed]">
                MST Testnet Protocol Online
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-[#26d464]">
                Chain ID {CHAIN_ID}
              </span>
            </motion.div>

            {/* Kinetic Hero Display Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.12] text-balance"
            >
              Where Decades of Machining Experience{" "}
              <span className="text-[#26d464]">Never Retires</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-2xl mx-auto text-pretty font-normal"
            >
              Decades of shop-floor knowledge, CNC chatter dampening, and custom
              fixturing vanish when veteran machinists retire. Expendry captures
              this tacit knowledge, rewards contributors in EXPEN tokens on MST testnet, and
              empowers the next generation.
            </motion.p>

            {/* High-Impact Magnetic CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
            >
              <MagneticTrack strength={0.25} specular={false}>
                <Link href="/community">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-[#26d464]/20 hover:shadow-[#26d464]/35 font-montserrat uppercase tracking-wider font-semibold">
                    <span>Explore Community Knowledge</span>
                    <span className="ml-2 font-mono">→</span>
                  </Button>
                </Link>
              </MagneticTrack>
              <MagneticTrack strength={0.25} specular={false}>
                <Link href="/onboarding">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:border-[#26d464]/50">
                    <span>Connect Wallet & Onboard</span>
                  </Button>
                </Link>
              </MagneticTrack>
            </motion.div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              Cinematic CNC Optical Workstation Viewport (Hero Image)
             ────────────────────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-12 max-w-5xl mx-auto rounded-2xl specular-card laser-indicator bg-[#121212] border border-[#262626] overflow-hidden relative shadow-2xl group"
          >
            {/* Top Telemetry Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#26d464]" />
                <span className="text-[#ededed] font-semibold tracking-wider uppercase font-montserrat">
                  5-Axis CNC Precision Workstation
                </span>
                <span className="text-zinc-400">|</span>
                <span className="text-[#f97316] hidden sm:inline">Ti-6Al-4V Aerospace Spindle Feed</span>
              </div>
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <span className="text-[#f97316] font-bold">LASER: 532nm CALIBRATED</span>
                <span className="text-zinc-400">·</span>
                <span className="text-[#26d464] font-semibold">TOL: ±0.005mm</span>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[440px] overflow-hidden">
              <Image
                src="/images/hero-cnc-lathe.jpg"
                alt="5-Axis CNC Spindle and Lathe Tool Carving Precision Titanium Component with Green Telemetry Laser"
                width={1600}
                height={900}
                priority
                className="w-full h-full object-cover object-center brightness-95 contrast-105 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
              {/* Engineering Blueprint Reticle Crosshairs */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-24 h-24 border border-[#f97316]/40 rounded-full border-dashed flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#26d464] shadow-[0_0_8px_#26d464]" />
                </div>
              </div>

              {/* Bottom Gradient Fade */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent pointer-events-none" />
            </div>

            {/* Bottom HUD Metadata Bar */}
            <div className="relative z-20 px-4 py-2.5 bg-[#0e0e0e] border-t border-[#222222] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#a1a1aa]">
              <div className="flex items-center gap-3">
                <span className="text-[#ededed] font-bold">WORKPIECE: AEROSPACE SHAFT</span>
                <span className="text-zinc-400">/</span>
                <span>SPINDLE: 1,800 RPM</span>
                <span className="text-zinc-400">/</span>
                <span className="text-[#26d464]">COOLANT: 70 BAR DUAL JET</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">ON-CHAIN PROVENANCE:</span>
                <span className="text-[#f97316] font-semibold">MST-91562037</span>
              </div>
            </div>
          </motion.div>

          {/* ──────────────────────────────────────────────────────────
              Interactive DRO Machining Control Deck (Acoustic Spectrogram)
             ────────────────────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-14 max-w-4xl mx-auto rounded-2xl specular-card bg-[#121212] border border-[#262626] p-5 sm:p-7 shadow-2xl relative overflow-hidden"
          >
            {/* Header Telemetry Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#26d464] shadow-inner">
                  <IconAcoustics className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-[#ededed] uppercase tracking-wider">
                      Live Tacit Acoustic Analyzer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/30">
                      Spindle Harmonics
                    </span>
                  </div>
                  <div className="text-xs text-[#a1a1aa] font-mono mt-0.5">
                    Sensor Node: MIDC Bhosari Precision CNC Center · Active Alloy: {activePreset.name}
                  </div>
                </div>
              </div>

              {/* Alloy Switcher Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                {SPINDLE_PRESETS.map((p, idx) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setActivePresetIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg border transition ${
                      activePresetIndex === idx
                        ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] font-bold"
                        : "bg-[#141414] border-[#262626] text-[#a1a1aa] hover:text-[#a1a1aa]"
                    }`}
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Spectrogram Viewport */}
            <div className="mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#a1a1aa] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#26d464]" />
                  SPECTROGRAM: 1,200 Hz – 3,600 Hz FLUTTER BANDWIDTH
                </span>
                <button
                  type="button"
                  onClick={() => setAnalyzingFlutter(!analyzingFlutter)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                    analyzingFlutter
                      ? "bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40"
                      : "bg-[#181818] text-[#a1a1aa] border border-[#2e2e2e] hover:border-[#26d464]/40 hover:text-[#ededed]"
                  }`}
                >
                  <IconWrench className="w-3.5 h-3.5 text-[#26d464]" />
                  <span>{analyzingFlutter ? "Reset Flutter Test" : "Simulate Flutter Resonance"}</span>
                </button>
              </div>

              {/* 24-Bar Dynamic Graphic Equalizer */}
              <div
                className="h-28 w-full rounded-xl bg-[#090909] border border-[#222222] p-4 flex items-end justify-between gap-1 sm:gap-2 relative overflow-hidden"
                aria-label="Acoustic spectrum graph"
              >
                <div className="absolute top-2 left-3 text-[11px] font-mono text-[#a1a1aa]">
                  PEAK: {analyzingFlutter ? "2,420 Hz (CHTER)" : "1,800 Hz (STABLE)"} · dB: {analyzingFlutter ? "-12 dB" : "-42 dB"}
                </div>
                {[
                  35, 45, 60, 40, 75, 90, 50, 30, 65, 80, 95, 70, 85, 100, 65, 40,
                  55, 75, 45, 30, 25, 40, 50, 35,
                ].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            height: analyzingFlutter
                              ? [`${Math.min(100, height * 1.15)}%`, `${Math.max(20, height * 0.65)}%`, `${Math.min(100, height * 1.15)}%`]
                              : [`${height * 0.55}%`, `${height * 0.75}%`, `${height * 0.55}%`],
                          }
                    }
                    transition={{
                      duration: 0.8 + (i % 5) * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-full rounded-t-sm transition-colors duration-300 ${
                      analyzingFlutter
                        ? i > 11 && i < 16 ? "bg-[#f97316]" : "bg-[#26d464]/60"
                        : "bg-[#26d464]"
                    }`}
                    style={{ height: `${height * 0.65}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Readout Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#222222]">
                <span className="text-[#a1a1aa] block text-[11px] tracking-wider uppercase">SPINDLE SPEED</span>
                <span className="text-sm font-bold text-[#ededed]">{activePreset.rpm} RPM</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#222222]">
                <span className="text-[#a1a1aa] block text-[11px] tracking-wider uppercase">FEED CALIBRATION</span>
                <span className="text-sm font-bold text-[#26d464]">
                  {analyzingFlutter ? "0.15 mm/rev (High)" : activePreset.feed}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#222222]">
                <span className="text-[#a1a1aa] block text-[11px] tracking-wider uppercase">CUTTING TEMP</span>
                <span className="text-sm font-bold text-[#ededed]">{activePreset.temp}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#222222]">
                <span className="text-[#a1a1aa] block text-[11px] tracking-wider uppercase">RESONANCE STATUS</span>
                <span className={`text-sm font-bold ${analyzingFlutter ? "text-[#f97316]" : "text-[#26d464]"}`}>
                  {analyzingFlutter ? "Harmonic Flutter Warning" : "Calibrated (98.6%)"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. LIVE TELEMETRY MARQUEE TICKER (21st.dev Style Strip)
         ────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#080808] border-b border-[#1c1c1c] py-2 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#a1a1aa]">
          <div className="flex items-center gap-3">
            <span className="text-[#26d464] font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#26d464]" />
              MST TESTNET
            </span>
            <span className="text-white/20">/</span>
            <span>CHAIN ID: {CHAIN_ID}</span>
            <span className="text-white/20">/</span>
            <span>GAS: &lt;0.001 GWEI</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span>REWARD POOL: 10 EXPEN / POST</span>
            <span className="text-white/20">/</span>
            <span>DAILY CAP: {DAILY_CAP} EXPEN</span>
            <span className="text-white/20">/</span>
            <span className="text-[#26d464]">RAG GROUNDING: SARVAM 105B</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          3. SIX-PILLAR BENTO GRID (Core Ecosystem Portals)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Platform Architecture Portals"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0c0c0c]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#26d464]" />
                <span className="text-xs font-mono font-medium text-[#26d464] uppercase tracking-wider">
                  Complete Toolroom Workstation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
                Industrial Architecture & Operating Modules
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md">
              From shop-floor acoustic harmonics to on-chain patent timestamping and enterprise machine tool integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01: Experience Hub */}
            <Link href="/experience" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconAcoustics className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="accent" size="sm">
                      Simulator
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      Machinist Experience Hub
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      Harmonic vibration and chatter dampening simulator, audio recordings from master turners, and setup tricks.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Explore Simulator</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* 02: Blueprints CAD/CAM */}
            <Link href="/blueprints" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconBlueprint className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="default" size="sm">
                      GD&T Specs
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      Engineering Blueprints & CAD
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      STEP, DXF, and SolidWorks drawings for damped boring bars, soft pie jaws, and 5-axis tombstone fixtures.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Inspect Blueprints</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* 03: Sarvam AI Assistant */}
            <Link href="/agent" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconBrain className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="default" size="sm">
                      EN · HI · MR
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      Sarvam AI Machining Assistant
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      Voice-enabled operator consultation in English, Hindi, and Marathi with instant shop-floor BM25 RAG citations.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Launch Operator Terminal</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* 04: 3D CAD Tooling Inspector */}
            <Link href="/showcase" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconCube3D className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="accent" size="sm">
                      WebGL 60FPS
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      3D CAD Tooling Inspector
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      Inspect 4-station CNC turret geometries, dimensional calipers (±0.005mm), and lighting environments in Three.js.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Open 3D Workstation</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* 05: Prior Art Patent Ledger */}
            <Link href="/patent" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconShield className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="default" size="sm">
                      35 U.S.C. § 102
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      Prior Art Patent Ledger
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      Timestamp novel tooling jigs and setup geometries onto MST testnet to establish tamper-proof legal prior art.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Register Invention</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* 06: Partners & Investors */}
            <Link href="/partners" className="group block h-full">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card specular-interactive flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-lg bg-[#181818] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform flex items-center justify-center">
                      <IconFactory className="w-5 h-5 text-[#26d464]" />
                    </span>
                    <Badge variant="default" size="sm">
                      Enterprise
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-montserrat group-hover:text-[#26d464] transition-colors">
                      Manufacturer & Investor Portal
                    </h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed mt-1.5 font-poppins">
                      Toolroom digitization for machine tool OEMs (Mazak, Haas) and industrial Web3 tokenomics for institutional funds.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>View Partner Tracks</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. 3-STEP KNOWLEDGE LOOP
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="How Expendry Works"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0a0a0a]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              A Closed-Loop Knowledge Economy for Precision Manufacturing
            </h2>
            <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
              &quot;Where experience is never retired.&quot; We transform shop-floor
              wisdom into verifiable on-chain knowledge assets through a 3-step
              incentive loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Archive */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 specular-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-[#26d464] font-bold font-mono tracking-wider">KNOWLEDGE ARCHIVE</span>
                  <span className="p-1 rounded bg-[#181818] border border-[#262626] text-[#26d464]">
                    <IconLathe className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#ededed] font-display">
                  Capture Tacit Intuition
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                  Veterans record fixturing setups, chatter frequencies, and thermal offsets via structured audio memos or blueprint shares.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1f1f1f] flex flex-wrap gap-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">Setup Tips</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">Blueprints</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">Voice Notes</span>
              </div>
            </div>

            {/* Step 2: Mint */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 specular-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-[#26d464] font-bold font-mono tracking-wider">ON-CHAIN TOKEN MINT</span>
                  <span className="p-1 rounded bg-[#181818] border border-[#262626] text-[#26d464]">
                    <IconToken className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#ededed] font-display">
                  Mint EXPEN on MST Testnet
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                  Every valid post initiates an on-chain mint of {REWARD_PER_POST} EXPEN tokens directly to your wallet. Enforced by smart contracts up to {DAILY_CAP} EXPEN/day.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464]">
                <span>{REWARD_PER_POST} EXPEN / Post · Max {DAILY_CAP} EXPEN / Day</span>
              </div>
            </div>

            {/* Step 3: Consult */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 specular-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-[#26d464] font-bold font-mono tracking-wider">SARVAM AI RETRIEVAL</span>
                  <span className="p-1 rounded bg-[#181818] border border-[#262626] text-[#26d464]">
                    <IconBrain className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#ededed] font-display">
                  Consult Sarvam AI
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                  Apprentice machinists query the tacit knowledge base in Hindi, Marathi, or English. BM25-lite RAG injects exact veteran troubleshooting quotes.
                </p>
              </div>
              <div className="pt-3 border-t border-[#1f1f1f] flex flex-wrap gap-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">English</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">हिन्दी</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#a1a1aa]">मराठी</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. VETERAN TACIT STORIES & AUDIO LOGS
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Veteran Insights"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0c0c0c]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Authentic Machinist Service Dossiers
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Real field calibrations shared by master toolmakers with decades of spindle time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Persona 1: Rameshwar */}
            <div className="p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6 specular-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a1a1aa] uppercase">AEROSPACE INCONEL // 42 YRS EXP</span>
                  <span className="text-[#26d464] font-bold">Earned: 620 EXPEN</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464] shadow-inner">
                    <IconLathe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-display">
                      Rameshwar Kulkarni
                    </h3>
                    <p className="text-xs text-[#a1a1aa]">
                      Chief CNC Turning Specialist • MIDC Bhosari, Pune
                    </p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-[#ededed] italic p-4 bg-[#141414] border border-[#262626] rounded-xl text-white leading-relaxed shadow-inner">
                  &quot;When turning Inconel 718, handbook speeds cause rapid notch wear within 4 minutes. You have to listen for the high-frequency harmonic flutter at 1,800 RPM and back off the feed by 0.03 mm/rev while targeting high-pressure flood coolant right at the tool flank.&quot;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPlayingAudioSnippet(!playingAudioSnippet)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2e2e2e] text-xs font-mono text-[#ededed] hover:border-[#26d464]/50 transition"
                >
                  {playingAudioSnippet ? (
                    <IconPause className="w-3.5 h-3.5 text-[#26d464]" />
                  ) : (
                    <IconPlay className="w-3.5 h-3.5 text-[#26d464]" />
                  )}
                  <span>{playingAudioSnippet ? "Pause Audio Memo (02:44)" : "Listen to Voice Memo"}</span>
                </button>
                <span className="text-[11px] font-mono text-[#a1a1aa]">MST Block #4,812,042</span>
              </div>
            </div>

            {/* Persona 2: Devendra */}
            <div className="p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6 specular-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a1a1aa] uppercase">FORGING DIES // 29 YRS EXP</span>
                  <span className="text-[#26d464] font-bold">Earned: 450 EXPEN</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464] shadow-inner">
                    <IconCaliper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#ededed] font-display">
                      Devendra Patil
                    </h3>
                    <p className="text-xs text-[#a1a1aa]">
                      Precision Tool & Die Master • Kolhapur Industrial Hub
                    </p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-[#ededed] italic p-4 bg-[#141414] border border-[#262626] rounded-xl text-white leading-relaxed shadow-inner">
                  &quot;Junior operators often scrap entire D2 die blocks because they ignore thermal expansion during morning shifts. On a cold 18°C morning, your spindle grows by 12 microns over the first 45 minutes of warm-up before hitting thermal equilibrium.&quot;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                <Link
                  href="/experience"
                  className="text-xs font-mono text-[#26d464] hover:underline flex items-center gap-1.5"
                >
                  <span>View All 12 Archived Stories</span>
                  <span>→</span>
                </Link>
                <span className="text-[11px] font-mono text-[#a1a1aa]">MST Block #4,790,211</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. POTENTIOMETER & DRO TOKEN REWARD CALCULATOR
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="EXPEN Token Economics"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0a0a0a]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: DRO Potentiometer Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#26d464] font-semibold">
                  Operator Yield Calibrator
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
                  Calculate Your Monthly EXPEN Token Yield
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa]">
                  Move the stepper to see estimated on-chain rewards based on authentic shop-floor contributions.
                </p>
              </div>

              {/* DRO Console Box */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-6 specular-card">
                <div className="flex items-center justify-between border-b border-[#222222] pb-3 text-xs font-mono">
                  <span className="text-[#a1a1aa]">DAILY VALID CONTRIBUTIONS</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCalculatorPosts((prev) => Math.max(1, prev - 1))}
                      className="h-7 w-7 rounded bg-[#181818] border border-[#2e2e2e] text-[#ededed] hover:border-[#26d464] font-bold"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-[#ededed] px-2">{calculatorPosts} Posts</span>
                    <button
                      type="button"
                      onClick={() => setCalculatorPosts((prev) => Math.min(10, prev + 1))}
                      className="h-7 w-7 rounded bg-[#181818] border border-[#2e2e2e] text-[#ededed] hover:border-[#26d464] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={calculatorPosts}
                    onChange={(e) => setCalculatorPosts(Number(e.target.value))}
                    className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#26d464]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#a1a1aa]">
                    <span>1 Post / Day</span>
                    <span>Daily Cap Threshold: 5 Posts (50 EXPEN)</span>
                    <span>10 Posts</span>
                  </div>
                </div>

                {/* DRO Metric Display Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#090909] border border-[#222222]">
                    <span className="text-[#a1a1aa] block text-[11px]">DAILY YIELD:</span>
                    <span className="text-lg font-bold text-[#26d464]">{calculatedDaily} EXPEN</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090909] border border-[#222222]">
                    <span className="text-[#a1a1aa] block text-[11px]">MONTHLY YIELD:</span>
                    <span className="text-lg font-bold text-[#ededed]">{calculatedMonthly} EXPEN</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090909] border border-[#222222]">
                    <span className="text-[#a1a1aa] block text-[11px]">USD VALUATION:</span>
                    <span className="text-lg font-bold text-[#ededed]">${calculatedUsd}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090909] border border-[#222222]">
                    <span className="text-[#a1a1aa] block text-[11px]">GAS FEES:</span>
                    <span className="text-lg font-bold text-[#26d464]">FREE (Gasless)</span>
                  </div>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex items-start gap-3 text-xs text-[#a1a1aa]">
                <IconAlert className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
                <span>
                  MST Testnet Protocol Notice: EXPEN is an educational utility token built for the MST Blockchain Buildathon to demonstrate shop-floor knowledge tokenization.
                </span>
              </div>
            </div>

            {/* Right: Milled Token Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-[#121212] p-6 border border-[#2e2e2e] shadow-2xl space-y-6 specular-card relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#a1a1aa]">
                    ERC-20 Token
                  </span>
                  <Badge variant="orange" size="sm">
                    MST Network
                  </Badge>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="h-20 w-20 rounded-full bg-[#181818] border-2 border-[#26d464] flex items-center justify-center shadow-lg shadow-[#26d464]/20">
                    <IconToken className="w-10 h-10 text-[#26d464]" />
                  </div>
                  <span className="mt-3 text-2xl font-black tracking-wider text-[#ededed] font-display">
                    EXPEN
                  </span>
                  <span className="text-xs text-[#a1a1aa] font-mono">
                    Expendry Utility Token
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-[#222222] pt-4 font-mono">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Chain ID</span>
                    <span className="text-[#ededed]">{CHAIN_ID}</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Decimals</span>
                    <span className="text-[#ededed]">18</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Daily Cap / Wallet</span>
                    <span className="text-[#26d464]">{DAILY_CAP} EXPEN</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[#1f1f1f]">
                    <span className="text-[#a1a1aa] text-[11px]">CONTRACT ADDRESS:</span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#0a0a0a] border border-[#262626]">
                      <a
                        href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#26d464] hover:underline truncate font-mono"
                      >
                        {EXPEN_ADDRESS.slice(0, 10)}...{EXPEN_ADDRESS.slice(-8)}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="px-2 py-0.5 text-[11px] rounded bg-[#1c1c1c] text-[#a1a1aa] hover:text-[#ededed] transition shrink-0"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
