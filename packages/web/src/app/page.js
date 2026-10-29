"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "@/components/ui/Icons";
import { CHAIN_ID, EXPLORER_URL, DAILY_CAP, REWARD_PER_POST } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [analyzingFlutter, setAnalyzingFlutter] = useState(false);
  const [calculatorPosts, setCalculatorPosts] = useState(3);
  const [copied, setCopied] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] relative selection:bg-[#26d464]/30 selection:text-[#ededed]">
      {/* ──────────────────────────────────────────────────────────
          1. HERO SECTION (Awwwards Grade Blueprint)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero Section"
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#1f1f1f] bg-blueprint-grid"
      >
        {/* Subtle Corner Engineering Crosshairs */}
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">+ [00,00]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">+ [CH-01 // MST-SYS]</div>
          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/20">[REF: 18.5204°N, 73.8567°E]</div>
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20">+</div>
        </div>

        {/* Ambient Radial Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[380px] bg-[#26d464]/10 blur-[140px] rounded-full"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Protocol Status Ribbon */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#121212] border border-[#262626] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
              <span className="text-xs font-mono font-medium text-[#ededed]">
                MST Testnet Protocol
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
              className="text-base sm:text-lg text-white leading-relaxed max-w-2xl mx-auto text-pretty"
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
              <Link href="/community">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-[#26d464]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <span>Explore Community Knowledge</span>
                  <span className="ml-2 font-mono">→</span>
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-semibold border border-white shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <span>Connect Wallet & Onboard</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              Live Interactive Machinist Acoustic HUD Widget (Awwwards Hallmark)
             ────────────────────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-12 max-w-4xl mx-auto rounded-2xl specular-card glass-panel p-5 sm:p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center shadow-inner">
                  <IconAcoustics className="w-5 h-5 text-[#26d464]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-[#ededed] uppercase tracking-wider">
                      Live Tacit Acoustic Analyzer
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/30">
                      Rameshwar Calibration
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    Simulating 1,800 RPM aerospace lathe chatter harmonic suppression · Inconel 718
                  </p>
                </div>
              </div>

              {/* State Switcher */}
              <button
                type="button"
                onClick={() => setAnalyzingFlutter((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#161616] border border-[#333333] hover:border-[#26d464]/60 text-[#ededed] transition-all self-start sm:self-auto flex items-center gap-2 shadow-sm"
              >
                <span className={`h-2 w-2 rounded-full ${analyzingFlutter ? "bg-amber-400 animate-pulse" : "bg-[#26d464]"}`} />
                <span>Mode: {analyzingFlutter ? "Handbook Flutter (Warning)" : "Veteran Damped (Calibrated)"}</span>
              </button>
            </div>

            {/* Simulated Dynamic Sound Frequency Spectrum with dB Ticks */}
            <div className="py-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] px-1">
                <span>0.2 kHz // -42 dB</span>
                <span className={analyzingFlutter ? "text-amber-400 font-bold" : "text-[#26d464] font-bold"}>
                  {analyzingFlutter ? "1.8 kHz // -6 dB (CHATTER SPIKE)" : "1.8 kHz // -14 dB (DAMPED)"}
                </span>
                <span>3.4 kHz // -28 dB</span>
                <span>7.2 kHz // -54 dB</span>
              </div>

              <div className="flex items-end justify-between gap-1.5 h-20 px-2.5 py-1.5 bg-[#0a0a0a] rounded-lg border border-[#222222]">
                {[45, 60, 85, 30, 95, 75, 40, 80, 55, 90, 70, 35, 88, 65, 48, 92, 78, 50, 84, 62, 38, 70, 52, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            height: analyzingFlutter
                              ? [`${Math.min(100, height * 1.2)}%`, `${Math.max(20, height * 0.6)}%`, `${Math.min(100, height * 1.2)}%`]
                              : [`${height * 0.6}%`, `${height * 0.8}%`, `${height * 0.6}%`],
                          }
                    }
                    transition={{
                      duration: 0.8 + (i % 5) * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-full rounded-t-sm transition-colors duration-300 ${
                      analyzingFlutter
                        ? i > 12 && i < 18 ? "bg-amber-400" : "bg-[#26d464]/60"
                        : "bg-[#26d464]"
                    }`}
                    style={{ height: `${height * 0.7}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Readout Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#0e0e0e] border border-white/[0.04]">
                <span className="text-[#a1a1aa] block text-[10px] tracking-wider uppercase">SPINDLE SPEED</span>
                <span className="text-sm font-bold text-[#ededed]">1,800 RPM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e0e0e] border border-white/[0.04]">
                <span className="text-[#a1a1aa] block text-[10px] tracking-wider uppercase">FEED CALIBRATION</span>
                <span className="text-sm font-bold text-[#26d464]">
                  {analyzingFlutter ? "0.15 mm/rev (High)" : "0.12 mm/rev (-0.03)"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e0e0e] border border-white/[0.04]">
                <span className="text-[#a1a1aa] block text-[10px] tracking-wider uppercase">TOOL FLANK COOLANT</span>
                <span className="text-sm font-bold text-[#ededed]">70 Bar Pressure</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e0e0e] border border-white/[0.04]">
                <span className="text-[#a1a1aa] block text-[10px] tracking-wider uppercase">RESONANCE STATUS</span>
                <span className={`text-sm font-bold ${analyzingFlutter ? "text-amber-400" : "text-[#26d464]"}`}>
                  {analyzingFlutter ? "Flutter Warning" : "Calibrated (98.6%)"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ──────────────────────────────────────────────────────────
              Three Entry-Point CTAs Bento Grid (Above Fold)
             ────────────────────────────────────────────────────────── */}
          <h2 className="sr-only">Platform Highlights</h2>
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* CTA 1: Machinist Knowledge Feed */}
            <motion.div variants={itemVariants}>
              <Link href="/community" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform shadow-inner flex items-center justify-center">
                        <IconLathe className="w-6 h-6 text-[#26d464]" />
                      </span>
                      <Badge variant="default" size="sm">
                        Feed
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors text-lg font-bold">
                      Machinist Knowledge Feed
                    </CardTitle>
                    <CardDescription className="text-xs text-[#a1a1aa] leading-relaxed">
                      Browse authentic shop-floor setups, blueprints, custom fixturing
                      tips, and carbide wear advice calibrated by veterans.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-mono">
                      View 5 Post Categories →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* CTA 2: EXPEN Rewards on MST */}
            <motion.div variants={itemVariants}>
              <Link href="/onboarding" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform shadow-inner flex items-center justify-center">
                        <IconToken className="w-6 h-6 text-[#26d464]" />
                      </span>
                      <Badge variant="accent" size="sm">
                        {REWARD_PER_POST} EXPEN / Post
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors text-lg font-bold">
                      Earn EXPEN on MST Testnet
                    </CardTitle>
                    <CardDescription className="text-xs text-[#a1a1aa] leading-relaxed">
                      Connect your BridgeKey or MetaMask wallet. Earn {REWARD_PER_POST} EXPEN per
                      verified post up to the {DAILY_CAP} EXPEN daily limit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-mono">
                      Connect Wallet Now →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* CTA 3: Sarvam AI Machining Assistant */}
            <motion.div variants={itemVariants}>
              <Link href="/agent" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/60 group-hover:shadow-lg group-hover:shadow-[#26d464]/10 transition-all duration-300 relative overflow-hidden specular-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464] group-hover:scale-105 transition-transform shadow-inner flex items-center justify-center">
                        <IconBrain className="w-6 h-6 text-[#26d464]" />
                      </span>
                      <Badge variant="default" size="sm">
                        EN / HI / MR
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors text-lg font-bold">
                      Consult Sarvam Machining AI
                    </CardTitle>
                    <CardDescription className="text-xs text-[#a1a1aa] leading-relaxed">
                      Ask questions in English, Hindi, or Marathi with voice
                      support. Answers are enriched via BM25 RAG from veteran posts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-mono">
                      Launch AI Assistant →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE 3D TOOLING INSPECTOR SHOWCASE TEASER
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="3D Tooling Teaser Section"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0c0c0c] relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8 sm:p-12 relative overflow-hidden shadow-2xl specular-card">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="accent" size="sm">
                    Interactive WebGL 3D
                  </Badge>
                  <span className="text-xs font-mono text-[#a1a1aa]">Three.js & OrbitControls</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ededed] font-display text-balance">
                  Inspect Critical Tooling Geometries in High-Fidelity 3D
                </h2>

                <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed text-pretty">
                  Examine lathe chuck bodies, indexable carbide insert pockets, flute reliefs,
                  and toolholder geometries before ordering or setting up your CNC machine.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/showcase">
                    <Button variant="primary" size="md" className="font-semibold shadow-md">
                      <span>Launch 3D Model Inspector</span>
                      <span className="ml-1.5 font-mono">→</span>
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="secondary" size="md">
                      <span>Browse Tooling Marketplace</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Teaser 3D Preview Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-xl bg-[#161616] border border-[#2c2c2c] p-6 text-center space-y-4 shadow-xl">
                  <div className="h-32 rounded-lg bg-[#0e0e0e] border border-[#222222] flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                    <div className="group-hover:rotate-12 transition-transform duration-300">
                      <IconCube3D className="w-10 h-10 text-[#26d464]" />
                    </div>
                    <span className="text-xs font-mono text-[#26d464]">CNC Lathe Body & Bit Geometry</span>
                    <span className="absolute bottom-2 right-2 text-xs font-mono text-[#a1a1aa]">WebGL 60FPS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-[#a1a1aa] pt-1 border-t border-[#222222]">
                    <span>Tolerance: ±0.005mm</span>
                    <span className="text-[#26d464]">Inserts: TiAlN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. HOW EXPENDRY WORKS (3-Step Knowledge Loop)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="About Story Section"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0a0a0a]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="accent" size="sm">
              How Expendry Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display text-balance">
              A Knowledge Economy for Precision Manufacturing
            </h2>
            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed text-pretty">
              &quot;Where experience is never retired.&quot; We transform shop-floor
              wisdom into verifiable on-chain knowledge assets through a 3-step
              incentive loop.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal dashed connector on desktop */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-1/2 left-12 right-12 h-px border-t border-dashed border-[#262626] -translate-y-6 pointer-events-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1: Archive */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.1 }}
              >
                <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between hover:border-[#383838] transition-all specular-card">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                        01 // ARCHIVE TACIT WISDOM
                      </span>
                      <span className="p-1 rounded bg-[#161616] border border-[#262626]">
                        <IconBlueprint className="w-5 h-5 text-[#26d464]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#ededed] font-display mb-2">
                      Share Tacit Knowledge
                    </h3>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">
                      Veteran machinists document spindle calibrations, chatter
                      dampening setups, fixturing jigs, and carbide wear patterns
                      across 5 structured post formats.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex flex-wrap gap-1.5">
                    <Badge variant="default" size="sm">Experience</Badge>
                    <Badge variant="default" size="sm">Blueprint</Badge>
                    <Badge variant="default" size="sm">Setup Tip</Badge>
                  </div>
                </Card>
              </motion.div>

              {/* Step 2: Mint */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.2 }}
              >
                <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between hover:border-[#383838] transition-all specular-card">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                        02 // MINT EXPEN TOKENS
                      </span>
                      <span className="p-1 rounded bg-[#161616] border border-[#262626]">
                        <IconToken className="w-5 h-5 text-[#26d464]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#ededed] font-display mb-2">
                      Earn EXPEN on MST Testnet
                    </h3>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">
                      Every valid post initiates an on-chain mint of {REWARD_PER_POST} EXPEN tokens
                      directly to your wallet. Enforced by operator smart contracts
                      with a strict {DAILY_CAP} EXPEN daily safety cap.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                    <div className="flex items-center justify-between text-xs text-[#26d464] font-medium bg-[#26d464]/10 px-3 py-1.5 rounded-lg border border-[#26d464]/20 font-mono">
                      <span>{REWARD_PER_POST} EXPEN / Post</span>
                      <span>Max {DAILY_CAP} EXPEN / Day</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Step 3: Consult */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.3 }}
              >
                <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between hover:border-[#383838] transition-all specular-card">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                        03 // CONSULT SARVAM AI
                      </span>
                      <span className="p-1 rounded bg-[#161616] border border-[#262626]">
                        <IconBrain className="w-5 h-5 text-[#26d464]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#ededed] font-display mb-2">
                      Discover & Consult Sarvam AI
                    </h3>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">
                      New operators query the tacit knowledge base using the Sarvam
                      AI assistant in Hindi, Marathi, or English. BM25-lite RAG
                      injects exact veteran blueprint snippets.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex flex-wrap gap-1.5">
                    <Badge variant="default" size="sm">Hindi (हिन्दी)</Badge>
                    <Badge variant="default" size="sm">Marathi (मराठी)</Badge>
                    <Badge variant="default" size="sm">Voice STT/TTS</Badge>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3.5 ECOSYSTEM HUBS DIRECTORY (Industry-Ready Platform Hubs)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Ecosystem Hubs"
        className="py-16 sm:py-24 border-b border-[#1f1f1f] bg-[#0a0a0a]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
                <span className="text-xs font-mono font-medium text-[#26d464] uppercase tracking-wider">
                  Seven Core Ecosystem Portals
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hub 1: Experience */}
            <Link href="/experience" className="group">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 transition-all space-y-3 flex flex-col justify-between specular-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#26d464] font-bold">01 // EXPERIENCE</span>
                    <IconAcoustics className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display group-hover:text-[#26d464] transition-colors">
                    Machinist Experience Hub
                  </h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Interactive chatter harmonics simulator, veteran audio recordings, and field-tested lathe and mill tricks.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Explore Simulator</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Hub 2: Blueprints */}
            <Link href="/blueprints" className="group">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 transition-all space-y-3 flex flex-col justify-between specular-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#26d464] font-bold">02 // BLUEPRINTS</span>
                    <IconBlueprint className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display group-hover:text-[#26d464] transition-colors">
                    CAD/CAM Blueprints & GD&T
                  </h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    STEP, DXF, and SolidWorks drawings for damped boring bars, soft jaws, and 5-axis tombstone fixtures.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Inspect Drawings</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Hub 3: Patents */}
            <Link href="/patent" className="group">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 transition-all space-y-3 flex flex-col justify-between specular-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#26d464] font-bold">03 // PATENTS</span>
                    <IconShield className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display group-hover:text-[#26d464] transition-colors">
                    Prior Art Patent Ledger
                  </h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Cryptographic SHA-256 timestamping on MST testnet blocks providing 35 U.S.C. § 102 prior art defense.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>Timestamp Invention</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Hub 4: Partner Program */}
            <Link href="/partners" className="group">
              <div className="h-full p-6 rounded-2xl bg-[#121212] border border-[#262626] group-hover:border-[#26d464]/60 transition-all space-y-3 flex flex-col justify-between specular-card">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#26d464] font-bold">04 // PARTNERS</span>
                    <IconToken className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display group-hover:text-[#26d464] transition-colors">
                    Enterprise & Investors
                  </h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Dedicated portals for Machine Tool Builders, factory toolroom digitization, and industrial Web3 tokenomics.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1f1f1f] text-xs font-mono text-[#26d464] flex items-center justify-between">
                  <span>View Partner Tracks</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. VETERAN TACIT WISDOM PERSONAS (Authentic Service Dossiers)
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Operator Insights Section"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0c0c0c]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="accent" size="sm">
              Operator Insights & Service Records
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display text-balance">
              Tacit Wisdom from India&apos;s Master Machinists
            </h2>
            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed text-pretty">
              Authentic machinist service dossiers reflecting real-world shop-floor
              calibrations, alloy limits, and generational knowledge preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Persona 1: Rameshwar Dossier */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-8 relative flex flex-col justify-between shadow-xl specular-card">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#161616] border border-[#262626] font-mono text-[10px] uppercase tracking-wider text-[#a1a1aa]">
                      VERIFIED VETERAN OPERATOR // 34 YRS AEROSPACE
                    </span>
                    <span className="text-xs font-mono text-[#26d464] bg-[#26d464]/10 px-2 py-0.5 rounded border border-[#26d464]/30">
                      Earned: 320 EXPEN
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-lg bg-[#1a1a1a] border border-[#383838] flex items-center justify-center shadow-inner">
                      <IconWrench className="w-7 h-7 text-[#26d464]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#ededed] font-display">
                        Rameshwar Kulkarni
                      </h3>
                      <p className="text-xs text-[#a1a1aa]">
                        Chief CNC Turning Specialist • Aerospace Inconel • Pune, Maharashtra
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-sm text-[#ededed]/95 italic pl-4 py-3 my-4 leading-relaxed bg-[#161616] border-l border-[#26d464] rounded-r-md shadow-inner">
                    &quot;When turning Inconel 718, handbook speeds cause rapid notch wear within 4 minutes. You have to listen for the high-frequency harmonic flutter at 1,800 RPM and back off the feed by 0.03 mm/rev while targeting high-pressure flood coolant right at the tool flank.&quot;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                  <p className="text-xs uppercase tracking-wider text-[#a1a1aa] font-semibold mb-2 font-mono">
                    Key Tacit Themes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" size="sm">Inconel 718 Turning</Badge>
                    <Badge variant="default" size="sm">Chatter Dampening</Badge>
                    <Badge variant="default" size="sm">Tool Flank Wear</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Persona 2: Devendra Dossier */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-8 relative flex flex-col justify-between shadow-xl specular-card">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#161616] border border-[#262626] font-mono text-[10px] uppercase tracking-wider text-[#a1a1aa]">
                      VERIFIED TOOL & DIE MASTER // 29 YRS FORGING
                    </span>
                    <span className="text-xs font-mono text-[#26d464] bg-[#26d464]/10 px-2 py-0.5 rounded border border-[#26d464]/30">
                      Earned: 450 EXPEN
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-lg bg-[#1a1a1a] border border-[#383838] flex items-center justify-center shadow-inner">
                      <IconCaliper className="w-7 h-7 text-[#26d464]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#ededed] font-display">
                        Devendra Patil
                      </h3>
                      <p className="text-xs text-[#a1a1aa]">
                        Precision Tool & Die Master • Auto Component Forging • Kolhapur, Maharashtra
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-sm text-[#ededed]/95 italic pl-4 py-3 my-4 leading-relaxed bg-[#161616] border-l border-[#26d464] rounded-r-md shadow-inner">
                    &quot;Junior operators often scrap entire D2 die blocks because they ignore thermal expansion during morning shifts. On a cold 18°C morning, your spindle grows by 12 microns over the first 45 minutes of warm-up before hitting thermal equilibrium.&quot;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                  <p className="text-xs uppercase tracking-wider text-[#a1a1aa] font-semibold mb-2 font-mono">
                    Key Tacit Themes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" size="sm">D2 Die Steel</Badge>
                    <Badge variant="default" size="sm">Spindle Thermal Drift</Badge>
                    <Badge variant="default" size="sm">Micron Calibration</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* 4 Tacit Knowledge Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center hover:border-[#26d464]/40 transition-colors specular-card flex flex-col items-center">
              <IconBolt className="w-5 h-5 text-[#26d464] mb-2" />
              <span className="text-xs font-bold text-[#ededed] font-display block">Feeds & Speeds</span>
              <span className="text-xs text-[#a1a1aa] mt-0.5">Non-standard alloy limits</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center hover:border-[#26d464]/40 transition-colors specular-card flex flex-col items-center">
              <IconAcoustics className="w-5 h-5 text-[#26d464] mb-2" />
              <span className="text-xs font-bold text-[#ededed] font-display block">Chatter Dampening</span>
              <span className="text-xs text-[#a1a1aa] mt-0.5">Acoustic flutter tuning</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center hover:border-[#26d464]/40 transition-colors specular-card flex flex-col items-center">
              <IconClamp className="w-5 h-5 text-[#26d464] mb-2" />
              <span className="text-xs font-bold text-[#ededed] font-display block">Custom Fixturing</span>
              <span className="text-xs text-[#a1a1aa] mt-0.5">Thin-wall deflection jigs</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center hover:border-[#26d464]/40 transition-colors specular-card flex flex-col items-center">
              <IconThermal className="w-5 h-5 text-[#26d464] mb-2" />
              <span className="text-xs font-bold text-[#ededed] font-display block">Scrap Reduction</span>
              <span className="text-xs text-[#a1a1aa] mt-0.5">Thermal expansion defense</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. EXPEN TOKENOMICS & POTENTIOMETER CALCULATOR SECTION
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="EXPEN Token Explainer"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0a0a0a] relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#26d464]/10 blur-[130px] rounded-full"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Tokenomics & Vernier Potentiometer Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  EXPEN Tokenomics • MST Testnet
                </Badge>
                <span className="text-xs text-[#a1a1aa] font-mono">
                  Chain ID: {CHAIN_ID}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display text-balance">
                A Transparent On-Chain Economy Rewarding Machining Heritage
              </h2>

              <p className="text-base text-[#a1a1aa] leading-relaxed text-pretty">
                EXPEN is the native utility and reputation token of the
                Expendry ecosystem. Built on the high-throughput MST Blockchain
                Testnet, EXPEN tokens are programmatically minted to machinists
                upon sharing verified shop-floor insights.
              </p>

              {/* Potentiometer-Styled Token Reward Calculator */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 shadow-lg specular-card">
                <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-[#ededed] tracking-wider">
                      DRO Reward Calibrator
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded bg-[#161616] border border-[#262626] text-xs font-mono font-bold text-[#26d464] shadow-inner">
                    {Math.min(calculatorPosts * REWARD_PER_POST, DAILY_CAP)} EXPEN MINTED
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#a1a1aa]">Verified Knowledge Posts Today:</span>
                    <span className="font-bold text-[#ededed] px-2 py-0.5 rounded bg-[#1c1c1c] border border-[#2e2e2e]">
                      {calculatorPosts} / 5 Cap
                    </span>
                  </div>

                  {/* Range Slider with pot ticks */}
                  <div className="relative pt-2 pb-1">
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={calculatorPosts}
                      onChange={(e) => setCalculatorPosts(Number(e.target.value))}
                      className="w-full accent-[#26d464] cursor-pointer h-2 bg-[#1a1a1a] rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#71717a] mt-2">
                      <span>1 Post (10 EXPEN)</span>
                      <span>3 Posts (30 EXPEN)</span>
                      <span>5 Posts (50 EXPEN Cap)</span>
                      <span>6+ (Protected)</span>
                    </div>
                  </div>

                  {/* Progress bar towards daily cap */}
                  <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#26d464] h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (calculatorPosts / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-2xl font-bold text-[#26d464] font-display">
                    {REWARD_PER_POST} EXPEN
                  </div>
                  <div className="text-xs font-medium text-[#ededed] mt-1">
                    Reward per Approved Post
                  </div>
                  <div className="text-xs text-[#a1a1aa] mt-0.5">
                    Gasless operator-signed mint
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-2xl font-bold text-[#26d464] font-display">
                    {DAILY_CAP} EXPEN
                  </div>
                  <div className="text-xs font-medium text-[#ededed] mt-1">
                    Strict Daily Cap per Wallet
                  </div>
                  <div className="text-xs text-[#a1a1aa] mt-0.5">
                    Resets automatically at 00:00 UTC
                  </div>
                </div>
              </div>

              {/* Testnet Disclaimer */}
              <div className="p-4 rounded-xl bg-[#161616] border border-amber-500/30 flex items-start gap-3">
                <IconAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-[#a1a1aa] leading-relaxed">
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    MST Testnet Prototype Notice
                  </span>
                  EXPEN is an educational testnet utility token on the MST
                  Blockchain testnet. It holds zero real-world monetary or fiat
                  value and is strictly designed to validate Web3 tokenomics and
                  experience reward loops.
                </div>
              </div>

              <div className="pt-2">
                <Link href="/community">
                  <Button variant="primary" size="lg" className="shadow-lg shadow-[#26d464]/10 hover:shadow-[#26d464]/20">
                    Join Community & Start Earning EXPEN
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Holographic Dark Token Card with One-Click Copy */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -8, 0],
                        transition: {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
                className="w-full max-w-sm rounded-2xl bg-[#121212] p-6 border border-[#2e2e2e] shadow-2xl shadow-black/80 space-y-6 specular-card relative overflow-hidden"
              >
                {/* Metallic diagonal hairline effect */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 bg-[#26d464]/10 rounded-full blur-3xl"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#a1a1aa]">
                    ERC-20 Token
                  </span>
                  <Badge variant="accent" size="sm">
                    MST Network
                  </Badge>
                </div>

                {/* Token Emblem */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-24 w-24 rounded-full bg-[#181818] border-2 border-[#26d464] flex items-center justify-center shadow-lg shadow-[#26d464]/25">
                    <IconToken className="w-12 h-12 text-[#26d464]" />
                  </div>
                  <span className="mt-3 text-2xl font-black tracking-wider text-[#ededed] font-display">
                    EXPEN
                  </span>
                  <span className="text-xs text-[#a1a1aa] font-mono">
                    Expendry Token
                  </span>
                </div>

                {/* Token Specs */}
                <div className="space-y-2.5 text-xs border-t border-[#262626] pt-4 font-mono">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Decimals</span>
                    <span className="text-[#ededed]">18</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Daily Cap</span>
                    <span className="text-[#26d464]">{DAILY_CAP} EXPEN</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Reward / Post</span>
                    <span className="text-[#26d464]">{REWARD_PER_POST} EXPEN</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-[#222222]">
                    <span className="text-[#a1a1aa] text-[11px]">Contract Address:</span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#0a0a0a] border border-[#262626]">
                      <a
                        href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#26d464] hover:underline truncate font-mono"
                        title={EXPEN_ADDRESS}
                      >
                        {EXPEN_ADDRESS.slice(0, 10)}...{EXPEN_ADDRESS.slice(-8)}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="px-2 py-0.5 text-[10px] rounded bg-[#1c1c1c] text-[#a1a1aa] hover:text-[#ededed] transition shrink-0"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
