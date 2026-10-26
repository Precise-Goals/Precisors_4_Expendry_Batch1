"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { CHAIN_ID, EXPLORER_URL, DAILY_CAP, REWARD_PER_POST } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section
        aria-label="Hero Section"
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#1f1f1f]"
      >
        {/* Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#26d464]/10 blur-[120px] rounded-full"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
              <Badge variant="accent" size="md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
                MST Testnet • Chain ID {CHAIN_ID}
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.15]"
            >
              Where Decades of Machining Experience{" "}
              <span className="text-[#26d464]">Never Retires</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[#a1a1aa] leading-relaxed max-w-2xl mx-auto"
            >
              Decades of shop-floor knowledge, CNC chatter dampening, and custom
              fixturing vanish when veteran machinists retire. Expendry captures
              this tacit knowledge, rewards contributors in EXPEN tokens, and
              empowers the next generation.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link href="/community">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Explore Community Knowledge
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Connect Wallet & Onboard
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Three Entry-Point CTAs Above Fold */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* CTA 1: Community Feed */}
            <motion.div variants={itemVariants}>
              <Link href="/community" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464]">
                        🛠️
                      </span>
                      <Badge variant="default" size="sm">
                        Feed
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors">
                      Machinist Knowledge Feed
                    </CardTitle>
                    <CardDescription>
                      Browse real-world machining tips, blueprints, setup tricks,
                      and tooling feeds calibrated by veterans.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:underline inline-flex items-center gap-1">
                      View 5 Post Categories →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* CTA 2: EXPEN Rewards */}
            <motion.div variants={itemVariants}>
              <Link href="/onboarding" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464]">
                        🪙
                      </span>
                      <Badge variant="accent" size="sm">
                        {REWARD_PER_POST} EXPEN / Post
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors">
                      Earn EXPEN on MST Testnet
                    </CardTitle>
                    <CardDescription>
                      Connect your BridgeKey or MetaMask wallet. Earn {REWARD_PER_POST} EXPEN per
                      verified post up to the {DAILY_CAP} EXPEN daily cap.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:underline inline-flex items-center gap-1">
                      Connect Wallet Now →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            {/* CTA 3: Sarvam AI Agent */}
            <motion.div variants={itemVariants}>
              <Link href="/agent" className="block group h-full">
                <Card
                  interactive
                  className="h-full border-[#262626] group-hover:border-[#26d464]/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464]">
                        🤖
                      </span>
                      <Badge variant="default" size="sm">
                        EN / HI / MR
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors">
                      Consult Sarvam Machining AI
                    </CardTitle>
                    <CardDescription>
                      Ask questions in English, Hindi, or Marathi with voice
                      support. Answers are enriched via BM25 RAG from machinist posts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs font-semibold text-[#26d464] group-hover:underline inline-flex items-center gap-1">
                      Launch AI Assistant →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Story Section — 3-Step Explainer */}
      <section
        aria-label="About Story Section"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0c0c0c]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="accent" size="sm">
              How Expendry Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display">
              A Knowledge Economy for Precision Manufacturing
            </h2>
            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
              &quot;Where experience is never retired.&quot; We transform shop-floor
              wisdom into immutable on-chain knowledge assets through a 3-step
              incentive loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1: Share */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.1 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                      STEP 01
                    </span>
                    <span className="text-2xl">📐</span>
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

            {/* Step 2: Earn */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.2 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                      STEP 02
                    </span>
                    <span className="text-2xl">🪙</span>
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
                  <div className="flex items-center justify-between text-xs text-[#26d464] font-medium bg-[#26d464]/10 px-3 py-1.5 rounded-lg border border-[#26d464]/20">
                    <span>{REWARD_PER_POST} EXPEN / Post</span>
                    <span>Max {DAILY_CAP} EXPEN / Day</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Step 3: Discover */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.3 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-[#26d464] px-2.5 py-1 rounded bg-[#26d464]/10 border border-[#26d464]/30">
                      STEP 03
                    </span>
                    <span className="text-2xl">🤖</span>
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
      </section>

      {/* Operator Insight Section — Veteran Personas */}
      <section
        aria-label="Operator Insights Section"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0a0a0a]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="accent" size="sm">
              Operator Insights & Personas
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display">
              Tacit Wisdom from India&apos;s Master Machinists
            </h2>
            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed">
              Illustrative veteran profiles reflecting real-world machining
              challenges, tooling calibrations, and generational knowledge
              preservation.
            </p>
          </div>

          {/* Two Illustrative Persona Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Persona 1: Rameshwar */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-8 relative flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <Badge variant="accent" size="sm">
                      Illustrative Persona • 34 Years Exp.
                    </Badge>
                    <span className="text-xs font-mono text-[#26d464] bg-[#26d464]/10 px-2 py-0.5 rounded border border-[#26d464]/30">
                      Earned: 320 EXPEN
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-[#1a1a1a] border border-[#383838] flex items-center justify-center text-2xl">
                      👨‍🏭
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

                  <blockquote className="text-sm text-[#ededed]/90 italic border-l-2 border-[#26d464] pl-4 py-1 my-4 leading-relaxed bg-[#161616]/50 rounded-r">
                    &quot;When turning Inconel 718, handbook speeds cause rapid notch wear within 4 minutes. You have to listen for the high-frequency harmonic flutter at 1,800 RPM and back off the feed by 0.03 mm/rev while targeting high-pressure flood coolant right at the tool flank.&quot;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                  <p className="text-xs uppercase tracking-wider text-[#71717a] font-semibold mb-2">
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

            {/* Persona 2: Devendra */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            >
              <Card className="h-full bg-[#121212] border-[#262626] p-8 relative flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <Badge variant="accent" size="sm">
                      Illustrative Persona • 29 Years Exp.
                    </Badge>
                    <span className="text-xs font-mono text-[#26d464] bg-[#26d464]/10 px-2 py-0.5 rounded border border-[#26d464]/30">
                      Earned: 450 EXPEN
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-[#1a1a1a] border border-[#383838] flex items-center justify-center text-2xl">
                      🔧
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

                  <blockquote className="text-sm text-[#ededed]/90 italic border-l-2 border-[#26d464] pl-4 py-1 my-4 leading-relaxed bg-[#161616]/50 rounded-r">
                    &quot;Junior operators often scrap entire D2 die blocks because they ignore thermal expansion during morning shifts. On a cold 18°C morning, your spindle grows by 12 microns over the first 45 minutes of warm-up before hitting thermal equilibrium.&quot;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                  <p className="text-xs uppercase tracking-wider text-[#71717a] font-semibold mb-2">
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

          {/* 4 Knowledge Themes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center">
              <span className="text-xl mb-1 block">⚡</span>
              <span className="text-xs font-bold text-[#ededed] font-display block">Feeds & Speeds</span>
              <span className="text-[11px] text-[#71717a]">Non-standard alloy limits</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center">
              <span className="text-xl mb-1 block">🔊</span>
              <span className="text-xs font-bold text-[#ededed] font-display block">Chatter Dampening</span>
              <span className="text-[11px] text-[#71717a]">Acoustic flutter tuning</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center">
              <span className="text-xl mb-1 block">🗜️</span>
              <span className="text-xs font-bold text-[#ededed] font-display block">Custom Fixturing</span>
              <span className="text-[11px] text-[#71717a]">Thin-wall deflection jigs</span>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f] text-center">
              <span className="text-xl mb-1 block">🔍</span>
              <span className="text-xs font-bold text-[#ededed] font-display block">Scrap Reduction</span>
              <span className="text-[11px] text-[#71717a]">Thermal expansion defense</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPEN Token Explainer Section with Animated Token Card */}
      <section
        aria-label="EXPEN Token Explainer"
        className="py-20 sm:py-28 border-b border-[#1f1f1f] bg-[#0c0c0c] relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#26d464]/10 blur-[130px] rounded-full"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Tokenomics narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  EXPEN Tokenomics • MST Testnet
                </Badge>
                <span className="text-xs text-[#71717a] font-mono">
                  Chain ID: {CHAIN_ID}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#ededed] font-display">
                A Transparent On-Chain Economy Rewarding Machining Heritage
              </h2>

              <p className="text-base text-[#a1a1aa] leading-relaxed">
                EXPEN is the native utility and reputation token of the
                Expendry ecosystem. Built on the high-throughput MST Blockchain
                Testnet, EXPEN tokens are programmatically minted to machinists
                upon sharing verified shop-floor insights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626]">
                  <div className="text-2xl font-bold text-[#26d464] font-display">
                    {REWARD_PER_POST} EXPEN
                  </div>
                  <div className="text-xs font-medium text-[#ededed] mt-1">
                    Reward per Approved Post
                  </div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">
                    Gasless operator-signed mint
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626]">
                  <div className="text-2xl font-bold text-[#26d464] font-display">
                    {DAILY_CAP} EXPEN
                  </div>
                  <div className="text-xs font-medium text-[#ededed] mt-1">
                    Strict Daily Cap per Wallet
                  </div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">
                    Resets automatically at 00:00 UTC
                  </div>
                </div>
              </div>

              {/* Testnet Disclaimer */}
              <div className="p-4 rounded-xl bg-[#161616] border border-amber-500/30 flex items-start gap-3">
                <span className="text-amber-400 text-lg">⚠️</span>
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
                  <Button variant="primary" size="lg">
                    Join Community & Start Earning EXPEN
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Animated Token Card */}
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
                className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] p-1 border border-[#333333] shadow-2xl shadow-black/80"
              >
                <div className="rounded-xl bg-[#121212] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-mono text-[#71717a]">
                      ERC-20 Token
                    </span>
                    <Badge variant="accent" size="sm">
                      MST Network
                    </Badge>
                  </div>

                  {/* Token Emblem */}
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#26d464]/20 via-[#26d464]/10 to-transparent border-2 border-[#26d464] flex items-center justify-center shadow-lg shadow-[#26d464]/20">
                      <span className="text-4xl">⚙️</span>
                    </div>
                    <span className="mt-3 text-2xl font-black tracking-wider text-[#ededed] font-display">
                      EXPEN
                    </span>
                    <span className="text-xs text-[#71717a] font-mono">
                      Expendry Token
                    </span>
                  </div>

                  {/* Token Specs */}
                  <div className="space-y-2.5 text-xs border-t border-[#1f1f1f] pt-4 font-mono">
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
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-[#71717a] text-[10px]">Contract Address</span>
                      <a
                        href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#26d464] hover:underline truncate"
                        title={EXPEN_ADDRESS}
                      >
                        {EXPEN_ADDRESS}
                      </a>
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
