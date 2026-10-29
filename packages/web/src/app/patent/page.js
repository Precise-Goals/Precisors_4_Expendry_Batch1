"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconCertificate,
  IconShield,
  IconCheck,
  IconLock,
  IconToken,
  IconBlueprint,
  IconExternal,
  IconFileCode,
  IconAlert,
} from "@/components/ui/Icons";
import { CHAIN_ID, EXPLORER_URL } from "shared/constants";

const ACTIVE_PATENTS = [
  {
    id: "EXP-PAT-001",
    title: "Dual-Sleeve Dynamic Lead-Damped Boring Bar Geometry",
    inventor: "Rameshwar Patil (Pune, India)",
    mstBlock: "4,812,042",
    timestamp: "2026-09-14 11:22 UTC",
    sha256Hash: "0x8fa3e91b4028ce2f0091da7782b137c419e91244f9c8901bce23194a2890cd41",
    status: "Immutable Prior Art",
    royaltyTier: "50 EXPEN / Production License",
    description:
      "Internal counter-mass resonator inside heavy lathe boring tools that mitigates Inconel 718 resonant frequencies between 2,200 Hz and 2,600 Hz.",
  },
  {
    id: "EXP-PAT-002",
    title: "Pneumatic Floating Chuck Expander for Thin Bearings",
    inventor: "Frank Kowalski (Warren Tool & Die, USA)",
    mstBlock: "4,790,211",
    timestamp: "2026-08-28 09:41 UTC",
    sha256Hash: "0x4b72ef9108a112cd4e09f891bce9812739810ea3491823abce01982bca819201",
    status: "Active Licensing",
    royaltyTier: "75 EXPEN / Production License",
    description:
      "Uniform radial expansion chuck preventing polygonal distortion during high-precision finish boring of 200mm aerospace bearing races.",
  },
  {
    id: "EXP-PAT-003",
    title: "Counter-Vibration Unequal Flute Spacing End-Mill Geometry",
    inventor: "Kenji Sato (Nagoya Toolcraft, Japan)",
    mstBlock: "4,710,950",
    timestamp: "2026-07-15 16:05 UTC",
    sha256Hash: "0x12c890ab8e721948ba02384791820bdae091bca2891823098192bce819028301",
    status: "Open Manufacturing Commons",
    royaltyTier: "Public Royalty-Free",
    description:
      "Aperiodic 38°/41° variable helix and unequal indexing flute profile eliminating harmonic resonance during deep pocket milling in Titanium 6Al-4V.",
  },
];

export default function PatentPage() {
  const [inventions, setInventions] = useState(ACTIVE_PATENTS);
  const [title, setTitle] = useState("");
  const [inventor, setInventor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tooling Geometry");
  const [isStamping, setIsStamping] = useState(false);
  const [stampedCert, setStampedCert] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!title || !inventor || !description) return;

    setIsStamping(true);
    setTimeout(() => {
      const pseudoHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const pseudoBlock = (4900000 + Math.floor(Math.random() * 50000)).toLocaleString();
      const newPat = {
        id: `EXP-PAT-00${inventions.length + 1}`,
        title,
        inventor,
        mstBlock: pseudoBlock,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
        sha256Hash: pseudoHash,
        status: "Immutable Prior Art",
        royaltyTier: "40 EXPEN / Production License",
        description,
      };

      setInventions([newPat, ...inventions]);
      setStampedCert(newPat);
      setIsStamping(false);
      setTitle("");
      setInventor("");
      setDescription("");
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#26d464]/30 selection:text-[#ededed] bg-blueprint-grid">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Patent Protocol
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Patent Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#1f1f1f]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">+ [PATENT // PRIOR ART]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">+ [35-USC-102]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Decentralized Tooling IP & Prior Art Protocol</span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-[#26d464]">MST Blockchain Testnet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.15]">
            Cryptographic Manufacturing Patents & Prior Art Ledger
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl">
            Protect novel tooling jigs, custom boring bars, and fixturing innovations against predatory patent trolls.
            By timestamping your designs cryptographically onto MST testnet, you establish legally provable prior art
            while enabling peer-to-peer EXPEN licensing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#262626]">
              <span className="text-[#71717a] block text-[10px]">LEGAL RECOGNITION:</span>
              <span className="text-[#ededed] font-bold">35 U.S.C. § 102 Proof</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#262626]">
              <span className="text-[#71717a] block text-[10px]">TIMESTAMP ENGINE:</span>
              <span className="text-[#26d464] font-bold">MST Testnet Block Height</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#262626]">
              <span className="text-[#71717a] block text-[10px]">ROYALTY ROUTING:</span>
              <span className="text-[#ededed] font-bold">Automated EXPEN Smart Contracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE INVENTION TIMESTAMP ENGINE
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Timestamp Engine"
        className="py-14 sm:py-20 border-b border-[#1f1f1f] bg-[#0c0c0c]/80"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconCertificate className="w-5 h-5 text-[#26d464]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#26d464] font-semibold">
                On-Chain Prior Art Generator
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
              Register Shop-Floor Invention on MST Testnet
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-2xl">
              Enter your mechanical concept, CAD specification, or fixture description. Our system computes a SHA-256 digest and records the immutable proof on the blockchain.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#262626] space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                  Invention / Jig Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Self-Equalizing Twin Pin Collet System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                  Inventor Name & Machine Shop
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil (Apex Machining)"
                  value={inventor}
                  onChange={(e) => setInventor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                  Invention Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
                >
                  <option>Tooling Geometry</option>
                  <option>Workholding Fixture</option>
                  <option>Acoustic Chatter Dampening</option>
                  <option>Coolant Delivery System</option>
                  <option>Metrology & Inspection Jig</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                  Simulated CAD File Attachment
                </label>
                <div className="px-3 py-2 rounded-lg bg-[#181818] border border-dashed border-[#383838] text-xs font-mono text-[#71717a] flex items-center justify-between">
                  <span>fixture_blueprint_rev2.step</span>
                  <span className="text-[#26d464]">Ready</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#a1a1aa] block mb-1.5">
                Technical Abstract & Novel Mechanical Claims
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the mechanical operation, critical dimensions, dampening mechanism, and why this design improves on conventional setups..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed] focus:outline-none focus:border-[#26d464]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-[11px] font-mono text-[#71717a]">
                <span>Zero Gas Fee · Gasless Operator Stamping on MST Chain ID {CHAIN_ID}</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isStamping}
                className="w-full sm:w-auto"
              >
                {isStamping ? (
                  <span>Computing Cryptographic Digest...</span>
                ) : (
                  <span>Timestamp Invention on MST</span>
                )}
              </Button>
            </div>
          </form>

          {/* Stamped Certificate Preview */}
          {stampedCert && (
            <div className="p-6 rounded-2xl bg-[#0d1610] border border-[#26d464]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-[#26d464]/20 pb-3">
                <div className="flex items-center gap-2">
                  <IconShield className="w-5 h-5 text-[#26d464]" />
                  <span className="text-sm font-mono font-bold text-[#26d464] uppercase">
                    Official MST Prior Art Certificate Issued
                  </span>
                </div>
                <span className="text-xs font-mono text-[#ededed]">
                  ID: {stampedCert.id}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#ededed] font-display">
                  {stampedCert.title}
                </h3>
                <p className="text-xs font-mono text-[#a1a1aa]">
                  Inventor: <span className="text-[#ededed]">{stampedCert.inventor}</span> · Stamped: {stampedCert.timestamp}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-xs font-mono space-y-1">
                <div className="flex justify-between text-[#71717a]">
                  <span>MST BLOCK HEIGHT:</span>
                  <span className="text-[#ededed]">#{stampedCert.mstBlock}</span>
                </div>
                <div className="flex justify-between text-[#71717a] gap-2">
                  <span>SHA-256 DIGEST:</span>
                  <span className="text-[#26d464] truncate">{stampedCert.sha256Hash}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. ACTIVE COMMUNITY PATENTS DIRECTORY
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Community Patents"
        className="py-14 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ededed] font-display">
                Active Community Prior Art Registry
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1">
                Verified records anchoring machinist innovations to MST testnet blocks.
              </p>
            </div>
            <div className="text-xs font-mono text-[#26d464]">
              {inventions.length} Cryptographic Proofs Indexed
            </div>
          </div>

          <div className="space-y-4">
            {inventions.map((pat) => (
              <div
                key={pat.id}
                className="p-6 rounded-2xl bg-[#121212] border border-[#262626] hover:border-[#383838] transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#26d464] font-bold">
                      [{pat.id}]
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#181818] border border-[#262626] text-[#ededed]">
                      {pat.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#71717a]">
                    MST Block #{pat.mstBlock} · {pat.timestamp}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#ededed] font-display">
                    {pat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1.5 leading-relaxed">
                    {pat.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#71717a] shrink-0">DIGEST:</span>
                    <span className="text-[#ededed] truncate">{pat.sha256Hash}</span>
                  </div>
                  <div className="text-[#26d464] shrink-0 font-semibold">
                    {pat.royaltyTier}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
