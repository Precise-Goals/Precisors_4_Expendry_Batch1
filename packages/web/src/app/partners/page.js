"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  IconFactory,
  IconTrendingUp,
  IconHandshake,
  IconCheck,
  IconBrain,
  IconToken,
  IconShield,
  IconArrowRight,
  IconCaliper,
  IconAcoustics,
} from "@/components/ui/Icons";
import { CHAIN_ID, DAILY_CAP, REWARD_PER_POST, OPERATOR_ADDRESS } from "shared/constants";

export default function PartnersPage() {
  const [activeTrack, setActiveTrack] = useState("manufacturers");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [scale, setScale] = useState("10-50 CNCs");
  const [submitted, setSubmitted] = useState(false);

  // Machine Shop ROI Calculator State
  const [spindles, setSpindles] = useState(24);
  const [monthlyToolSpend, setMonthlyToolSpend] = useState(15000);
  const [scrapRate, setScrapRate] = useState(4.5);

  // Estimated annual savings = scrap reduction (approx 35% of current scrap) + tooling life extension
  const estimatedAnnualScrap = (spindles * monthlyToolSpend * 12 * (scrapRate / 100));
  const estimatedSavings = Math.round(estimatedAnnualScrap * 0.38);
  const estimatedExpenMints = Math.round(spindles * 1.5 * REWARD_PER_POST * 260); // approx posts per year

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
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#262626]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500">+ [ENTERPRISE // PARTNERS]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500">+ [MST-{CHAIN_ID}]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Expendry Strategic Ecosystem</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-[#26d464]">Manufacturers & Investors</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-montserrat leading-[1.15]">
            Partner Program for Machine Tool Builders & Industrial Investors
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl font-poppins">
            Bridge heavy industrial manufacturing with decentralized tacit knowledge tokenization.
            Whether you operate 50 CNC machines or back industrial Web3 protocols, Expendry offers
            institutional infrastructure, custom Sarvam AI RAG integrations, and verifiable token economics.
          </p>

          {/* Track Switcher Dock */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTrack("manufacturers")}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeTrack === "manufacturers"
                  ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] shadow-lg shadow-[#26d464]/10"
                  : "bg-[#121212] border-[#262626] text-[#a1a1aa] hover:text-[#ededed] hover:border-[#383838]"
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
                  : "bg-[#121212] border-[#262626] text-[#a1a1aa] hover:text-[#ededed] hover:border-[#383838]"
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
        className="py-14 sm:py-20 border-b border-[#262626] bg-[#0c0c0c]/90"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {activeTrack === "manufacturers" ? (
            <div className="space-y-12">
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-montserrat">
                  Transform Factory Floor Brain Drain into a Proprietary Intelligence Engine
                </h2>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                  When your top toolmaker leaves, your scrap rate spikes. Expendry deploys non-intrusive voice memo stations and Sarvam AI assistants directly into your toolrooms.
                </p>
              </div>

              {/* Enterprise Interactive ROI Calculator */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <IconCaliper className="w-5 h-5 text-[#26d464]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#26d464] font-bold">
                      Enterprise Scrap Reduction & Token Yield Calculator
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#a1a1aa]">Simulated 12-Month Pro-Forma</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Spindles */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#a1a1aa]">Active CNC Spindles</span>
                      <span className="text-[#ededed] font-bold">{spindles} Units</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="1"
                      value={spindles}
                      onChange={(e) => setSpindles(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#26d464]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>5 units</span>
                      <span>150 units</span>
                    </div>
                  </div>

                  {/* Monthly Tooling Spend */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#a1a1aa]">Monthly Tooling Spend</span>
                      <span className="text-[#ededed] font-bold">${monthlyToolSpend.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="50000"
                      step="1000"
                      value={monthlyToolSpend}
                      onChange={(e) => setMonthlyToolSpend(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#26d464]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>$2k/mo</span>
                      <span>$50k/mo</span>
                    </div>
                  </div>

                  {/* Scrap Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#a1a1aa]">Current Scrap Rate</span>
                      <span className="text-red-400 font-bold">{scrapRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="0.5"
                      value={scrapRate}
                      onChange={(e) => setScrapRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#26d464]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>1.0%</span>
                      <span>12.0%</span>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-1">
                    <div className="text-[11px] font-mono uppercase text-[#a1a1aa]">
                      Est. Annual Scrap & Tooling Savings
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#26d464]">
                      +${estimatedSavings.toLocaleString()} / yr
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Based on 38% scrap deflection via Sarvam AI acoustic warnings
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-1">
                    <div className="text-[11px] font-mono uppercase text-[#a1a1aa]">
                      Est. Veteran Operator Token Retention
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#ededed]">
                      {estimatedExpenMints.toLocaleString()} EXPEN / yr
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Direct {REWARD_PER_POST} EXPEN incentives per validated shop troubleshooting log
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconBrain className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    Private Shop RAG Fine-Tuning
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                    Ground Sarvam AI on your specific machine fleet, proprietary part numbers, and fixture catalogues. Operators query setups in Hindi, Marathi, or English.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconToken className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    Enterprise EXPEN Reward Grants
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                    Provide internal bonus tokens to your senior machinists whenever they record a high-value troubleshooting note, creating authentic retention.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    Verified Tooling Supplier Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                    List cutting tools, chucks, and holders directly in the Expendry Marketplace with 3D Three.js CAD inspection and MST verification.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-montserrat">
                  Tokenomics of Real-World Industrial Tacit Intelligence
                </h2>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                  Unlike speculative meme tokens, EXPEN captures real value from precision manufacturing transactions, blueprint licensing, and decentralized patent claims on MST Testnet.
                </p>
              </div>

              {/* Web3 Investor Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">BLOCKCHAIN</div>
                  <div className="text-sm font-bold font-mono text-[#ededed] mt-1">MST Testnet</div>
                  <div className="text-[10px] font-mono text-[#26d464]">Chain {CHAIN_ID}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">MINT CAP</div>
                  <div className="text-sm font-bold font-mono text-[#ededed] mt-1">{DAILY_CAP} EXPEN/day</div>
                  <div className="text-[10px] font-mono text-[#a1a1aa]">Per Wallet Hard Limit</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">GASLESS RELAY</div>
                  <div className="text-sm font-bold font-mono text-[#26d464] mt-1">EIP-191 Auth</div>
                  <div className="text-[10px] font-mono text-zinc-500 truncate">{OPERATOR_ADDRESS.slice(0, 10)}...</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] specular-card">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">BURN MECHANISM</div>
                  <div className="text-sm font-bold font-mono text-[#ededed] mt-1">Deflationary</div>
                  <div className="text-[10px] font-mono text-[#26d464]">CAD & Patent Royalties</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconToken className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    Supply / Burn Equilibrium
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                    Minting is capped at 50 EXPEN/day per operator. Token burns occur on every blueprint CAD download and patent licensing royalty distribution.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconTrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    Real-World Asset (RWA) Utility
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                    Direct utility powering the Tooling Marketplace, AI query compute credits, and manufacturing jig prior art registration fees.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#181818] border border-[#2e2e2e] flex items-center justify-center text-[#26d464]">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#ededed] font-montserrat">
                    MST Blockchain Native
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-montserrat">
              Apply for the Expendry Partner Network
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-poppins">
              Our engineering team responds within 24 business hours with custom integration parameters.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#0d1610] border border-[#26d464]/40 specular-card text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#26d464]/20 border border-[#26d464]/40 flex items-center justify-center mx-auto text-[#26d464]">
                <IconCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#ededed] font-montserrat">
                Partnership Inquiry Dispatched
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa] max-w-md mx-auto">
                Thank you, {contactName || "Partner"} ({companyName}). Your partner dossier has been logged. Our ecosystem lead will reach out to {email} shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-5"
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
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] placeholder-zinc-500 focus:outline-none focus:border-[#26d464]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frank Kowalski"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] placeholder-zinc-500 focus:outline-none focus:border-[#26d464]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@precisionmachining.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] placeholder-zinc-500 focus:outline-none focus:border-[#26d464]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                    Fleet Size or Investment Focus
                  </label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                  >
                    <option>1-10 CNC Spindles</option>
                    <option>10-50 CNC Spindles</option>
                    <option>50+ Multi-Axis Toolroom</option>
                    <option>Tier 1 Aerospace/Defense Supplier</option>
                    <option>Web3 Industrial Venture Fund</option>
                    <option>Institutional Token Treasury</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-zinc-500">
                  Direct Response Guarantee: &lt; 24h
                </span>
                <Button type="submit" variant="primary" size="md">
                  <span>Submit Partnership Application</span>
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
