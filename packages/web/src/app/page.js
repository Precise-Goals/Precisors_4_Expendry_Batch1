"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

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
                MST Testnet • Chain ID 91562037
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
                        10 EXPEN / Post
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-[#26d464] transition-colors">
                      Earn EXPEN on MST Testnet
                    </CardTitle>
                    <CardDescription>
                      Connect your BridgeKey or MetaMask wallet. Earn 10 EXPEN per
                      verified post up to the 50 EXPEN daily cap.
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
                    Every valid post initiates an on-chain mint of 10 EXPEN tokens
                    directly to your wallet. Enforced by operator smart contracts
                    with a strict 50 EXPEN daily safety cap.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#1f1f1f]">
                  <div className="flex items-center justify-between text-xs text-[#26d464] font-medium bg-[#26d464]/10 px-3 py-1.5 rounded-lg border border-[#26d464]/20">
                    <span>10 EXPEN / Post</span>
                    <span>Max 50 EXPEN / Day</span>
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
    </div>
  );
}
