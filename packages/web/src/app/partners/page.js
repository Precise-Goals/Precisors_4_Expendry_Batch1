"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconFactory,
  IconTrendingUp,
  IconHandshake,
  IconCheck,
  IconBrain,
  IconToken,
  IconShield,
  IconArrowRight,
} from "@/components/ui/Icons";
import { CHAIN_ID, DAILY_CAP, REWARD_PER_POST } from "shared/constants";

export default function PartnersPage() {
  const [activeTrack, setActiveTrack] = useState("manufacturers");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [scale, setScale] = useState("10-50 CNCs");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#26d464]/30 selection:text-[#ededed] bg-blueprint-grid">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Partner Program
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Partners Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#1f1f1f]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">+ [ENTERPRISE // PARTNERS]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">+ [MST-{CHAIN_ID}]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Expendry Strategic Ecosystem</span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-[#26d464]">Manufacturers & Investors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.15]">
            Partner Program for Machine Tool Builders & Industrial Investors
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl">
            Bridge heavy industrial manufacturing with decentralized tacit knowledge tokenization.
            Whether you operate 50 CNC machines or back industrial Web3 protocols, Expendry offers
            institutional infrastructure, custom RAG integrations, and token economics.
          </p>

          {/* Track Switcher Dock */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTrack("manufacturers")}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeTrack === "manufacturers"
                  ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] shadow-lg shadow-[#26d464]/10"
                  : "bg-[#121212] border-[#262626] text-[#71717a] hover:text-[#ededed]"
              }`}
            >
              <IconFactory className="w-4 h-4 text-[#26d464]" />
              <span>For Machine Tool Manufacturers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTrack("investors")}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeTrack === "investors"
                  ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] shadow-lg shadow-[#26d464]/10"
                  : "bg-[#121212] border-[#262626] text-[#71717a] hover:text-[#ededed]"
              }`}
            >
              <IconTrendingUp className="w-4 h-4 text-[#26d464]" />
              <span>For Industrial Web3 Investors</span>
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. TRACK CONTENT: Manufacturers vs Investors
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Track Details"
        className="py-14 sm:py-20 border-b border-[#1f1f1f] bg-[#0c0c0c]/80"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {activeTrack === "manufacturers" ? (
            <div className="space-y-10">
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
                  Transform Factory Floor Brain Drain into a Proprietary Intelligence Engine
                </h2>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">
                  When your top toolmaker leaves, your scrap rate spikes. Expendry deploys non-intrusive voice memo stations and Sarvam AI assistants directly into your toolrooms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconBrain className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    Private Shop RAG Fine-Tuning
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    Ground Sarvam AI on your specific machine fleet, proprietary part numbers, and fixture catalogues. Operators query setups in Hindi, Marathi, or English.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconToken className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    Enterprise EXPEN Reward Grants
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    Provide internal bonus tokens to your senior machinists whenever they record a high-value troubleshooting note, creating authentic retention.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    Verified Tooling Supplier Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    List cutting tools, chucks, and holders directly in the Expendry Marketplace with 3D Three.js CAD inspection and MST verification.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
                  Tokenomics of Real-World Industrial Tacit Intelligence
                </h2>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">
                  Unlike speculative meme tokens, EXPEN captures real value from precision manufacturing transactions, blueprint licensing, and decentralized patent claims on MST Testnet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconToken className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    Supply / Burn Equilibrium
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    Minting is capped at 50 EXPEN/day per operator. Token burns occur on every blueprint CAD download and patent licensing royalty distribution.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconTrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    Real-World Asset (RWA) Utility
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    Direct utility powering the Tooling Marketplace, AI query compute credits, and manufacturing jig prior art registration fees.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    MST Blockchain Native
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                    Built for high throughput, predictable low-cost gas, and non-custodial EIP-191 personal sign compatibility for frictionless shop-floor adoption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. INTERACTIVE PARTNERSHIP APPLICATION FORM
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Partnership Application"
        className="py-14 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Apply for the Expendry Partner Network
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa]">
              Our engineering team responds within 24 business hours with custom integration parameters.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#0d1610] border border-[#26d464]/40 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#26d464]/20 border border-[#26d464]/40 flex items-center justify-center mx-auto text-[#26d464]">
                <IconCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#ededed] font-display">
                Partnership Inquiry Dispatched
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa] max-w-md mx-auto">
                Thank you, {contactName || "Partner"} ({companyName}). Your partner dossier has been logged. Our ecosystem lead will reach out to {email} shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Precision CNC Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Lead Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. r.sharma@apexmachining.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Operational Scale
                  </label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                  >
                    <option>1 - 10 CNC Machines / Early Fund</option>
                    <option>10 - 50 CNC Machines / Mid Fund</option>
                    <option>50+ CNC Machines / Institutional Tier</option>
                    <option>OEM Machine Tool Builder</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-[#26d464]/10"
                >
                  <span>Submit Partnership Dossier</span>
                  <span className="ml-2 font-mono">→</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
