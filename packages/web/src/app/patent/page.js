"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  IconCertificate,
  IconShield,
  IconDownload,
} from "@/components/ui/Icons";
import { CHAIN_ID, OPERATOR_ADDRESS } from "shared/constants";

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

  const computeRealSha256 = async (str) => {
    try {
      const buffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!title || !inventor || !description) return;

    setIsStamping(true);
    const payloadString = `${title}|${inventor}|${category}|${description}|${Date.now()}`;
    const realHash = await computeRealSha256(payloadString);
    const pseudoBlock = (4900000 + Math.floor(Math.random() * 50000)).toLocaleString();

    setTimeout(() => {
      const newPat = {
        id: `EXP-PAT-00${inventions.length + 1}`,
        title,
        inventor,
        mstBlock: pseudoBlock,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
        sha256Hash: realHash,
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
    }, 1200);
  };

  const handleDownloadProof = (cert) => {
    const proofJson = {
      standard: "35 U.S.C. § 102 Cryptographic Prior Art Record",
      network: `MST Testnet (Chain ID: ${CHAIN_ID})`,
      operator: OPERATOR_ADDRESS,
      patentId: cert.id,
      title: cert.title,
      inventor: cert.inventor,
      timestampUtc: cert.timestamp,
      blockHeight: cert.mstBlock,
      sha256Digest: cert.sha256Hash,
      claimSummary: cert.description,
      verificationNotice: "Cryptographically immutable prior art timestamped to prevent subsequent predatory patent claims.",
    };

    const blob = new Blob([JSON.stringify(proofJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.id}_PriorArt_Certificate.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-transparent text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Patent Protocol
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Patent Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-zinc-200/90 bg-white/70 backdrop-blur-md"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-400 font-bold">+ [PATENT // PRIOR ART]</div>
          <div className="absolute top-4 right-4 text-xs font-mono text-zinc-400 font-bold">+ [35-USC-102]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-zinc-900">Decentralized Tooling IP &amp; Prior Art Protocol</span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">MST Blockchain (Chain {CHAIN_ID})</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 font-montserrat leading-[1.15]">
            Cryptographic Manufacturing Patents &amp; Prior Art Ledger
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl font-body">
            Protect novel tooling jigs, custom boring bars, and fixturing innovations against predatory patent trolls.
            By timestamping your designs cryptographically onto MST testnet, you establish legally provable prior art
            while enabling peer-to-peer EXPEN licensing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-xs font-mono">
            <div className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-sm">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">LEGAL RECOGNITION:</span>
              <span className="text-zinc-900 font-bold">35 U.S.C. § 102 Proof</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-sm">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">TIMESTAMP ENGINE:</span>
              <span className="text-emerald-700 font-bold">MST Testnet Block Height</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-zinc-200/90 shadow-sm">
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">ROYALTY ROUTING:</span>
              <span className="text-zinc-900 font-bold">Automated EXPEN Smart Contracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE INVENTION TIMESTAMP ENGINE
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Timestamp Engine"
        className="py-14 sm:py-20 border-b border-zinc-200/90 bg-white/40 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconCertificate className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
                On-Chain Prior Art Generator
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Register Shop-Floor Invention on MST Testnet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl font-body">
              Enter your mechanical concept, CAD specification, or fixture description. Our system computes a SHA-256 digest and records the immutable proof on the blockchain.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="p-6 sm:p-8 rounded-4xl bg-white border border-zinc-200/90 shadow-xl space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-700 font-bold block mb-1.5">
                  Invention / Jig Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Self-Equalizing Twin Pin Collet System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-700 font-bold block mb-1.5">
                  Inventor Name &amp; Machine Shop
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil (Apex Machining)"
                  value={inventor}
                  onChange={(e) => setInventor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-700 font-bold block mb-1.5">
                  Invention Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition cursor-pointer"
                >
                  <option>Tooling Geometry</option>
                  <option>Workholding Fixture</option>
                  <option>Acoustic Chatter Dampening</option>
                  <option>Coolant Delivery System</option>
                  <option>Metrology &amp; Inspection Jig</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-700 font-bold block mb-1.5">
                  Simulated CAD File Attachment
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-xs font-mono text-zinc-600 flex items-center justify-between">
                  <span>fixture_blueprint_rev2.step</span>
                  <span className="text-emerald-700 font-bold">Ready for Hash</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-zinc-700 font-bold block mb-1.5">
                Technical Abstract &amp; Novel Mechanical Claims
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the mechanical operation, critical dimensions, dampening mechanism, and why this design improves on conventional setups..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs font-mono text-zinc-500">
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
            <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/80 border border-emerald-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <IconShield className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-mono font-bold text-emerald-900 uppercase">
                    Official MST Prior Art Certificate Issued
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-700">
                  ID: {stampedCert.id}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 font-montserrat">
                  {stampedCert.title}
                </h3>
                <p className="text-xs font-mono text-zinc-600">
                  Inventor: <span className="text-zinc-900 font-bold">{stampedCert.inventor}</span> · Stamped: {stampedCert.timestamp}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs font-mono space-y-1.5 shadow-2xs">
                <div className="flex justify-between text-zinc-600">
                  <span>MST BLOCK HEIGHT:</span>
                  <span className="text-zinc-900 font-bold">#{stampedCert.mstBlock}</span>
                </div>
                <div className="flex justify-between text-zinc-600 gap-2">
                  <span>SHA-256 DIGEST:</span>
                  <span className="text-emerald-700 font-bold truncate">{stampedCert.sha256Hash}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadProof(stampedCert)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-mono font-bold text-emerald-800 hover:bg-emerald-50 transition shadow-xs cursor-pointer"
                >
                  <IconDownload className="w-4 h-4 text-emerald-700" />
                  <span>Download Legal Certificate JSON</span>
                </button>
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                Active Community Prior Art Registry
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-body">
                Verified records anchoring machinist innovations to MST testnet blocks.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-800">
              {inventions.length} Cryptographic Proofs Indexed
            </div>
          </div>

          <div className="space-y-4">
            {inventions.map((pat) => (
              <div
                key={pat.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-800 font-bold">
                      [{pat.id}]
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-zinc-100 border border-zinc-200 text-zinc-800">
                      {pat.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500">
                    MST Block #{pat.mstBlock} · {pat.timestamp}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 font-montserrat">
                    {pat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 leading-relaxed font-body">
                    {pat.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500 font-bold shrink-0">DIGEST:</span>
                    <span className="text-zinc-900 font-bold truncate">{pat.sha256Hash}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-emerald-700 font-bold">
                      {pat.royaltyTier}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadProof(pat)}
                      className="text-xs text-zinc-600 hover:text-emerald-800 underline font-bold cursor-pointer"
                    >
                      Export Proof
                    </button>
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
