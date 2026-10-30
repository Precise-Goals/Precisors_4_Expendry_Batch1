"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import { Badge } from "@/components/ui/Badge";
import { MagneticTrack } from "@/components/ui/MagneticTrack";
import {
  IconAcoustics,
  IconLathe,
  IconToken,
  IconBrain,
  IconCube3D,
  IconBlueprint,
  IconWrench,
  IconCaliper,
  IconAlert,
  IconShield,
  IconFactory,
  IconPlay,
  IconPause,
} from "@/components/ui/Icons";
import { CHAIN_ID, EXPLORER_URL, DAILY_CAP, REWARD_PER_POST } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

const SPINDLE_PRESETS = [
  { name: "Inconel 718", rpm: 1800, feed: "0.12 mm/rev", temp: "420°C", load: "78%", optimalHz: "1,800 Hz" },
  { name: "AISI 4140 Prehard", rpm: 2400, feed: "0.18 mm/rev", temp: "360°C", load: "64%", optimalHz: "2,400 Hz" },
  { name: "Alloy Steel D2", rpm: 1200, feed: "0.08 mm/rev", temp: "290°C", load: "82%", optimalHz: "1,200 Hz" },
];

export default function Home() {
  const shouldReduceMotion = useSafeReducedMotion();
  const [analyzingFlutter, setAnalyzingFlutter] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [calculatorPosts, setCalculatorPosts] = useState(3);
  const [copied, setCopied] = useState(false);
  const [playingAudioSnippet, setPlayingAudioSnippet] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [activeLoopStep, setActiveLoopStep] = useState(0);

  const activePreset = SPINDLE_PRESETS[activePresetIndex];

  // Simulated audio playback progress bar
  useEffect(() => {
    if (!playingAudioSnippet) {
      return;
    }
    const timer = setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 100) {
          setPlayingAudioSnippet(false);
          return 0;
        }
        return prev + 1.25;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      setAudioProgress(0);
    };
  }, [playingAudioSnippet]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
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
    <div className="flex flex-col w-full min-h-screen bg-transparent text-[#09090b] relative selection:bg-[#16a34a]/20 selection:text-black">
      {/* ──────────────────────────────────────────────────────────
          1. HERO SECTION (High-Fidelity Architectural Layout)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero Section"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24   bg-transparent min-h-[580px] lg:min-h-[640px] flex items-center"
      >
        {/* Hero Background Photo (h.png) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
          style={{
            margin:"0% 3%"
          }}
        >
          <Image
            src="/images/h.png"
            alt=""
            fill
            priority
            quality={95}
            className="object-cover object-right lg:object-center"
            style={{
              borderRadius:"40rem 15rem 40rem 15rem",
            }}

          />
          {/* Directional gradient wash: preserves crystal-clear text contrast on left, reveals medical implants on right */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 sm:via-white/75 to-transparent z-10" /> */}
          {/* Soft top & bottom edge integration */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
          {/* <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/70 to-transparent z-10" /> */}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[480px] lg:min-h-[540px]">
            {/* Left Column: Bold Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
              {/* Protocol Status Beacon */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full liquid-glass-pill border border-[#e4e4e7] shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                <span className="text-xs font-mono font-bold text-zinc-900">
                  MST Testnet Protocol Online
                </span>
                <span className="text-zinc-500 font-bold">•</span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  Chain ID {CHAIN_ID}
                </span>
              </motion.div>

              {/* Massive Confident Display Headline with Modern Editorial Italics */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-extrabold tracking-tight text-[#09090b] leading-[1.06] text-balance font-montserrat"
                style={{
                  fontSize:"3rem"
                }}
              >
                Where Decades of <br />
                <span className="font-editorial-italic font-normal text-zinc-800 tracking-normal text-[1.06em]"
                style={{
                  fontFamily:"Montserrat"
                }}>
                  Machining Wisdom
                </span> <br />
                <span className="text-[#16a34a] font-extrabold tracking-tight">Never Retires</span>
              </motion.h1>

              {/* Subtitle with Genuine Product Mission */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-zinc-700 leading-relaxed max-w-lg font-poppins font-normal text-pretty"
              >
                When veteran machinists retire, decades of <span className="font-editorial-italic text-zinc-900 font-medium text-[1.04em]">shop-floor intuition</span>, vibration dampening, and cutter geometry vanish. Expendry captures this tacit knowledge, rewards contributors in EXPEN on MST testnet, and empowers the next generation.
              </motion.p>

              {/* Tactile Magnetic CTAs with Emil Kowalski Spring Physics */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <MagneticTrack strength={0.2} specular={true}>
                  <Link href="/community">
                    <button
                      type="button"
                      className="px-7 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/20 transition-all duration-150 active:scale-[0.97] select-none cursor-pointer flex items-center gap-2 group"
                    >
                      <span>Explore Community Knowledge</span>
                      <span className="group-hover:translate-x-1 transition-transform font-mono">→</span>
                    </button>
                  </Link>
                </MagneticTrack>

                <MagneticTrack strength={0.15} specular={true}>
                  <Link href="/showcase">
                    <button
                      type="button"
                      className="px-6 py-3.5 rounded-full liquid-glass-pill text-zinc-900 hover:text-emerald-800 font-bold text-sm sm:text-base transition-all select-none cursor-pointer flex items-center gap-2"
                    >
                      <IconCube3D className="w-4 h-4 text-emerald-700" />
                      <span>Inspect 3D Implants</span>
                    </button>
                  </Link>
                </MagneticTrack>
              </motion.div>

              {/* Micro-telemetry proof points */}
              <motion.div
                variants={itemVariants}
                className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600"
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                  <span>{REWARD_PER_POST} EXPEN / Verified Post</span>
                </span>
                <span className="text-zinc-500 font-bold">·</span>
                <span>Daily Cap: {DAILY_CAP} EXPEN</span>
                <span className="text-zinc-500 font-bold">·</span>
                <span className="text-[#ea580c] font-semibold">Gasless MST</span>
              </motion.div>
            </div>

            {/* Right Column: Contextual Glassmorphic Telemetry Overlay Pins on Background Photo */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 relative w-full h-full min-h-[280px] sm:min-h-[360px] flex flex-col justify-between items-start lg:items-end py-4 pointer-events-auto"
            >
              {/* Top Floating Telemetry Chip */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl liquid-glass border-2 border-emerald-600 shadow-xl shadow-emerald-950/10 text-xs font-mono select-none"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a] animate-ping" />
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[#09090b] text-[13px]">5-Axis CNC Precision Implants</span>
                  <span className="text-zinc-500 text-[11px]">Ti-6Al-4V ELI · Medical Grade</span>
                </div>
              </motion.div>

              {/* Bottom Floating Telemetry Chip */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-2xl text-xs font-mono text-white select-none mt-auto"
              >
                <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#26d464]">
                  <IconCaliper className="w-4 h-4 text-[#26d464]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#26d464] font-bold text-[13px]">±0.002 mm</span>
                    <span className="text-zinc-300 font-semibold text-[11px]">Verified CMM</span>
                  </div>
                  <span className="text-zinc-300 text-[10px]">MST-721 Digital Twin Provenance</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE DRO MACHINING CONTROL DECK
         ────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-transparent   relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl glass-card border border-zinc-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
            {/* Header Telemetry Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4  ">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center text-[#16a34a] shadow-inner">
                  <IconAcoustics className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-[#09090b] uppercase tracking-wider">
                      Live Tacit Acoustic Analyzer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/30">
                      Spindle Harmonics
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    Sensor Node: MIDC Bhosari Precision CNC Center · Active Alloy: {activePreset.name}
                  </div>
                </div>
              </div>

              {/* Alloy Switcher Pills with Context-Aware Spring Layout Morph */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] text-xs font-mono relative">
                {SPINDLE_PRESETS.map((p, idx) => {
                  const isSelected = activePresetIndex === idx;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setActivePresetIndex(idx)}
                      className={`relative px-3 py-1.5 rounded-lg transition-colors font-semibold z-10 active:scale-95 ${
                        isSelected
                          ? "text-white font-bold"
                          : "text-zinc-700 hover:text-zinc-950"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId={shouldReduceMotion ? undefined : "activeAlloyPill"}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 bg-emerald-800 rounded-lg shadow-sm -z-10"
                        />
                      )}
                      <span>{p.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spectrogram Viewport */}
            <div className="mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <span className="text-zinc-700 font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                  SPECTROGRAM: 1,200 Hz – 3,600 Hz FLUTTER BANDWIDTH
                </span>
                <button
                  type="button"
                  onClick={() => setAnalyzingFlutter(!analyzingFlutter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm ${
                    analyzingFlutter
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-white text-zinc-800 border border-[#e4e4e7] hover:bg-[#f4f4f5]"
                  }`}
                >
                  <IconWrench className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>{analyzingFlutter ? "Reset Flutter Test" : "Simulate Flutter Resonance"}</span>
                </button>
              </div>

              {/* 28-Bar Dynamic Graphic Equalizer */}
              <div
                className="h-28 w-full rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-end justify-between gap-1 sm:gap-1.5 relative overflow-hidden"
                aria-label="Acoustic spectrum graph"
              >
                <div className="absolute top-2 left-3 text-[11px] font-mono text-zinc-500 font-bold">
                  PEAK: {analyzingFlutter ? "2,420 Hz (CHATTER RES)" : `${activePreset.optimalHz} (STABLE)`} · dB: {analyzingFlutter ? "-12 dB" : "-42 dB"}
                </div>
                {[
                  35, 45, 60, 40, 75, 90, 50, 30, 65, 80, 95, 70, 85, 100, 65, 40,
                  55, 75, 45, 30, 25, 40, 50, 35, 60, 70, 45, 30
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
                      duration: 0.8 + (i % 6) * 0.12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-full rounded-t-sm transition-colors duration-300 ${
                      analyzingFlutter
                        ? i > 12 && i < 18 ? "bg-[#ea580c]" : "bg-[#16a34a]/60"
                        : "bg-[#26d464]"
                    }`}
                    style={{ height: `${height * 0.65}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Readout Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e4e4e7]">
                <span className="text-zinc-500 block text-[11px] tracking-wider uppercase font-semibold">SPINDLE SPEED</span>
                <span className="text-sm font-bold text-[#09090b] tabular-nums">{activePreset.rpm} RPM</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e4e4e7]">
                <span className="text-zinc-500 block text-[11px] tracking-wider uppercase font-semibold">FEED CALIBRATION</span>
                <span className="text-sm font-bold text-[#16a34a] tabular-nums">
                  {analyzingFlutter ? "0.15 mm/rev (High)" : activePreset.feed}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e4e4e7]">
                <span className="text-zinc-500 block text-[11px] tracking-wider uppercase font-semibold">CUTTING TEMP</span>
                <span className="text-sm font-bold text-[#09090b] tabular-nums">{activePreset.temp}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e4e4e7]">
                <span className="text-zinc-500 block text-[11px] tracking-wider uppercase font-semibold">RESONANCE STATUS</span>
                <span className={`text-sm font-bold ${analyzingFlutter ? "text-[#ea580c]" : "text-[#16a34a]"}`}>
                  {analyzingFlutter ? "Harmonic Flutter Warning" : "Calibrated (98.6%)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. LIVE TELEMETRY MARQUEE TICKER
         ────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#f8fafc]   py-2.5 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="text-[#16a34a] font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              MST TESTNET
            </span>
            <span className="text-zinc-500 font-bold">/</span>
            <span>CHAIN ID: {CHAIN_ID}</span>
            <span className="text-zinc-500 font-bold">/</span>
            <span>GAS: &lt;0.001 GWEI</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span>REWARD POOL: 10 EXPEN / POST</span>
            <span className="text-zinc-500 font-bold">/</span>
            <span>DAILY CAP: {DAILY_CAP} EXPEN</span>
            <span className="text-zinc-500 font-bold">/</span>
            <span className="text-[#16a34a] font-bold">RAG GROUNDING: SARVAM 105B</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. SIX-PILLAR INDUSTRIAL ARCHITECTURE GRID
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Platform Architecture Portals"
        className="py-16 sm:py-24   bg-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4   pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090b] font-display">
                Industrial Architecture & Operating Modules
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 font-poppins max-w-md">
              From shop-floor acoustic harmonics to on-chain patent timestamping and enterprise machine tool integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 01: Experience Hub */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/experience" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconAcoustics className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="accent" size="sm">
                        Simulator
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        Machinist Experience Hub
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        Harmonic vibration and chatter dampening simulator, audio recordings from master turners, and setup tricks.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>Explore Simulator</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>

            {/* 02: Blueprints CAD/CAM */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/blueprints" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconBlueprint className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="default" size="sm">
                        GD&T Specs
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        Engineering Blueprints & CAD
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        STEP, DXF, and SolidWorks drawings for damped boring bars, soft pie jaws, and 5-axis tombstone fixtures.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>Inspect Blueprints</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>

            {/* 03: Sarvam AI Assistant */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/agent" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconBrain className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="default" size="sm">
                        EN · HI · MR
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        Sarvam AI Machining Assistant
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        Voice-enabled operator consultation in English, Hindi, and Marathi with instant shop-floor BM25 RAG citations.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>Launch Operator Terminal</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>

            {/* 04: 3D CAD Tooling Inspector */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/showcase" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconCube3D className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="accent" size="sm">
                        WebGL 60FPS
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        3D CAD Tooling Inspector
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        Inspect 4-station CNC turret geometries, dimensional calipers (±0.005mm), and lighting environments in Three.js.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>Open 3D Workstation</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>

            {/* 05: Prior Art Patent Ledger */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/patent" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconShield className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="default" size="sm">
                        35 U.S.C. § 102
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        Prior Art Patent Ledger
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        Timestamp novel tooling jigs and setup geometries onto MST testnet to establish tamper-proof legal prior art.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>Register Invention</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>

            {/* 06: Partners & Investors */}
            <MagneticTrack strength={0.12} specular={true} className="h-full">
              <Link href="/partners" className="group block h-full">
                <div className="h-full p-7 rounded-3xl glass-card border border-zinc-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] text-emerald-800 group-hover:scale-105 transition-transform flex items-center justify-center shadow-inner">
                        <IconFactory className="w-5 h-5 text-emerald-800" />
                      </span>
                      <Badge variant="default" size="sm">
                        Enterprise
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#09090b] font-montserrat group-hover:text-emerald-800 transition-colors">
                        Manufacturer & Investor Portal
                      </h3>
                      <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 font-poppins">
                        Toolroom digitization for machine tool OEMs (Mazak, Haas) and industrial Web3 tokenomics for institutional funds.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 flex items-center justify-between font-bold">
                    <span>View Partner Tracks</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </MagneticTrack>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. 3-STEP KNOWLEDGE LOOP
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="How Expendry Works"
        className="py-16 sm:py-24   bg-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090b] font-display">
              A Closed-Loop Knowledge Economy for Precision Manufacturing
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-800">
              &quot;Where experience is never retired.&quot; We transform shop-floor
              wisdom into verifiable on-chain knowledge assets through a 3-step
              incentive loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Archive */}
            <div
              onClick={() => setActiveLoopStep(0)}
              className={`p-7 rounded-3xl border transition-all duration-300 space-y-4 flex flex-col justify-between cursor-pointer ${
                activeLoopStep === 0
                  ? "bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700/30"
                  : "bg-white border-zinc-200 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-emerald-800 font-bold tracking-wider">KNOWLEDGE ARCHIVE</span>
                  <span className="p-1.5 rounded-lg bg-white border border-[#e4e4e7] text-emerald-800 shadow-sm">
                    <IconLathe className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#09090b] font-display">
                  Capture Tacit Intuition
                </h3>
                <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
                  Veterans record fixturing setups, chatter frequencies, and thermal offsets via structured audio memos or blueprint shares.
                </p>
              </div>
              <div className="pt-3 border-t border-[#e4e4e7] flex flex-wrap gap-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">Setup Tips</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">Blueprints</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">Voice Notes</span>
              </div>
            </div>

            {/* Step 2: Mint */}
            <div
              onClick={() => setActiveLoopStep(1)}
              className={`p-7 rounded-3xl border transition-all duration-300 space-y-4 flex flex-col justify-between cursor-pointer ${
                activeLoopStep === 1
                  ? "bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700/30"
                  : "bg-white border-zinc-200 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-emerald-800 font-bold tracking-wider">ON-CHAIN TOKEN MINT</span>
                  <span className="p-1.5 rounded-lg bg-white border border-[#e4e4e7] text-emerald-800 shadow-sm">
                    <IconToken className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#09090b] font-display">
                  Mint EXPEN on MST Testnet
                </h3>
                <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
                  Every valid post initiates an on-chain mint of {REWARD_PER_POST} EXPEN tokens directly to your wallet. Enforced by smart contracts up to {DAILY_CAP} EXPEN/day.
                </p>
              </div>
              <div className="pt-3 border-t border-[#e4e4e7] text-xs font-mono text-emerald-800 font-bold">
                <span>{REWARD_PER_POST} EXPEN / Post · Max {DAILY_CAP} EXPEN / Day</span>
              </div>
            </div>

            {/* Step 3: Consult */}
            <div
              onClick={() => setActiveLoopStep(2)}
              className={`p-7 rounded-3xl border transition-all duration-300 space-y-4 flex flex-col justify-between cursor-pointer ${
                activeLoopStep === 2
                  ? "bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700/30"
                  : "bg-white border-zinc-200 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-emerald-800 font-bold tracking-wider">SARVAM AI RETRIEVAL</span>
                  <span className="p-1.5 rounded-lg bg-white border border-[#e4e4e7] text-emerald-800 shadow-sm">
                    <IconBrain className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#09090b] font-display">
                  Consult Sarvam AI
                </h3>
                <p className="text-xs text-zinc-700 mt-2 leading-relaxed">
                  Apprentice machinists query the tacit knowledge base in Hindi, Marathi, or English. BM25-lite RAG injects exact veteran troubleshooting quotes.
                </p>
              </div>
              <div className="pt-3 border-t border-[#e4e4e7] flex flex-wrap gap-1.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">English</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">हिन्दी</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#e4e4e7] text-zinc-800 font-medium">मराठी</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. VETERAN TACIT STORIES & AUDIO LOGS
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Veteran Insights"
        className="py-16 sm:py-24   bg-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090b] font-display">
              Authentic Machinist Service Dossiers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-700">
              Real field calibrations shared by master toolmakers with decades of spindle time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Persona 1: Rameshwar */}
            <div className="p-8 rounded-2xl glass-card border border-[#e4e4e7] space-y-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-700 uppercase font-bold">AEROSPACE INCONEL // 42 YRS EXP</span>
                  <span className="text-emerald-800 font-bold">Earned: 620 EXPEN</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center text-emerald-800 shadow-inner">
                    <IconLathe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#09090b] font-display">
                      Rameshwar Kulkarni
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium">
                      Chief CNC Turning Specialist • MIDC Bhosari, Pune
                    </p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-zinc-800 italic p-4 bg-[#f8fafc] border border-[#e4e4e7] rounded-xl leading-relaxed shadow-inner">
                  &quot;When turning Inconel 718, handbook speeds cause rapid notch wear within 4 minutes. You have to listen for the high-frequency harmonic flutter at 1,800 RPM and back off the feed by 0.03 mm/rev while targeting high-pressure flood coolant right at the tool flank.&quot;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#e4e4e7] space-y-3">
                {/* Audio Progress Scrubber */}
                {playingAudioSnippet && (
                  <div className="w-full h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-700"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPlayingAudioSnippet(!playingAudioSnippet)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#e4e4e7] text-xs font-mono text-zinc-900 hover:bg-[#f4f4f5] transition font-semibold active:scale-95 shadow-sm"
                  >
                    {playingAudioSnippet ? (
                      <IconPause className="w-3.5 h-3.5 text-emerald-800" />
                    ) : (
                      <IconPlay className="w-3.5 h-3.5 text-emerald-800" />
                    )}
                    <span>{playingAudioSnippet ? "Pause Audio Memo (02:44)" : "Listen to Voice Memo"}</span>
                  </button>
                  <span className="text-[11px] font-mono text-zinc-600 font-semibold">MST Block #4,812,042</span>
                </div>
              </div>
            </div>

            {/* Persona 2: Devendra */}
            <div className="p-8 rounded-2xl glass-card border border-[#e4e4e7] space-y-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-700 uppercase font-bold">FORGING DIES // 29 YRS EXP</span>
                  <span className="text-emerald-800 font-bold">Earned: 450 EXPEN</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center text-emerald-800 shadow-inner">
                    <IconCaliper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#09090b] font-display">
                      Devendra Patil
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium">
                      Precision Tool & Die Master • Kolhapur Industrial Hub
                    </p>
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-zinc-800 italic p-4 bg-[#f8fafc] border border-[#e4e4e7] rounded-xl leading-relaxed shadow-inner">
                  &quot;Junior operators often scrap entire D2 die blocks because they ignore thermal expansion during morning shifts. On a cold 18°C morning, your spindle grows by 12 microns over the first 45 minutes of warm-up before hitting thermal equilibrium.&quot;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
                <Link
                  href="/experience"
                  className="text-xs font-mono text-emerald-800 hover:underline flex items-center gap-1.5 font-bold"
                >
                  <span>View All 12 Archived Stories</span>
                  <span>→</span>
                </Link>
                <span className="text-[11px] font-mono text-zinc-600 font-semibold">MST Block #4,790,211</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. POTENTIOMETER & DRO TOKEN REWARD CALCULATOR
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="EXPEN Token Economics"
        className="py-16 sm:py-24 bg-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: DRO Potentiometer Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090b] font-display">
                  Calculate Your Monthly EXPEN Token Yield
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600">
                  Move the stepper to see estimated on-chain rewards based on authentic shop-floor contributions.
                </p>
              </div>

              {/* DRO Console Box */}
              <div className="p-7 rounded-3xl glass-card border border-zinc-200/90 space-y-6 shadow-md">
                <div className="flex items-center justify-between   pb-3 text-xs font-mono">
                  <span className="text-zinc-700 font-semibold">DAILY VALID CONTRIBUTIONS</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCalculatorPosts((prev) => Math.max(1, prev - 1))}
                      className="h-7 w-7 rounded-lg bg-white border border-[#e4e4e7] text-zinc-900 hover:bg-[#f4f4f5] font-bold shadow-sm active:scale-95 transition-transform"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-[#09090b] px-2 tabular-nums">{calculatorPosts} Posts</span>
                    <button
                      type="button"
                      onClick={() => setCalculatorPosts((prev) => Math.min(10, prev + 1))}
                      className="h-7 w-7 rounded-lg bg-white border border-[#e4e4e7] text-zinc-900 hover:bg-[#f4f4f5] font-bold shadow-sm active:scale-95 transition-transform"
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
                    className="w-full h-2 bg-[#e4e4e7] rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-zinc-500 font-medium">
                    <span>1 Post / Day</span>
                    <span>Daily Cap Threshold: 5 Posts (50 EXPEN)</span>
                    <span>10 Posts</span>
                  </div>
                </div>

                {/* DRO Metric Display Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] shadow-sm">
                    <span className="text-zinc-500 block text-[11px] font-semibold">DAILY YIELD:</span>
                    <span className="text-lg font-bold text-[#16a34a] tabular-nums">{calculatedDaily} EXPEN</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] shadow-sm">
                    <span className="text-zinc-500 block text-[11px] font-semibold">MONTHLY YIELD:</span>
                    <span className="text-lg font-bold text-[#09090b] tabular-nums">{calculatedMonthly} EXPEN</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] shadow-sm">
                    <span className="text-zinc-500 block text-[11px] font-semibold">USD VALUATION:</span>
                    <span className="text-lg font-bold text-[#09090b] tabular-nums">${calculatedUsd}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e4e4e7] shadow-sm">
                    <span className="text-zinc-500 block text-[11px] font-semibold">GAS FEES:</span>
                    <span className="text-lg font-bold text-[#16a34a]">FREE (Gasless)</span>
                  </div>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950 font-medium">
                <IconAlert className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <span>
                  MST Testnet Protocol Notice: EXPEN is an educational utility token built for the MST Blockchain Buildathon to demonstrate shop-floor knowledge tokenization.
                </span>
              </div>
            </div>

            {/* Right: Milled Token Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl glass-card p-7 border border-zinc-200/90 shadow-xl shadow-black/5 space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-mono text-zinc-600 font-bold">
                    ERC-20 Token
                  </span>
                  <Badge variant="orange" size="sm">
                    MST Network
                  </Badge>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-md">
                    <IconToken className="w-10 h-10 text-emerald-600" />
                  </div>
                  <span className="mt-3 text-2xl font-black tracking-wider text-[#09090b] font-display">
                    EXPEN
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    Expendry Utility Token
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-zinc-200 pt-4 font-mono">
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Chain ID</span>
                    <span className="text-[#09090b] font-bold">{CHAIN_ID}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Decimals</span>
                    <span className="text-[#09090b] font-bold">18</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>Daily Cap / Wallet</span>
                    <span className="text-emerald-700 font-bold">{DAILY_CAP} EXPEN</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-200">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                      <span>VERIFIED CONTRACT:</span>
                      <a
                        href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                      >
                        <span>MSTScan ↗</span>
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                      <a
                        href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-800 hover:underline truncate font-mono font-bold"
                      >
                        {EXPEN_ADDRESS.slice(0, 10)}...{EXPEN_ADDRESS.slice(-8)}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition shrink-0 font-bold shadow-2xs active:scale-95 cursor-pointer"
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
