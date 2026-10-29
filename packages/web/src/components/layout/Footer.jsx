import React from "react";
import Link from "next/link";
import { EXPLORER_URL, CHAIN_ID, REWARD_PER_POST, DAILY_CAP } from "shared/constants";
import { IconSpindle } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-[#262626] bg-[#070707] text-[#a1a1aa] relative overflow-hidden"
    >
      {/* Blueprint grid accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#26d464]/40 to-transparent" />

      {/* Engineering Header Datum Bar */}
      <div className="border-b border-[#1c1c1c] bg-[#0a0a0a]/90 py-2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#a1a1aa]">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">+ [00,00] DATUM</span>
            <span>·</span>
            <span className="text-[#f97316]">REF // ISO-2768-mK</span>
            <span>·</span>
            <span>SYS:MST-{CHAIN_ID}</span>
          </div>
          <div className="flex items-center gap-2 text-[#26d464]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#26d464]" />
            <span>OPERATOR TERMINAL ONLINE · GASLESS CONTRACTS ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white font-montserrat hover:text-[#26d464] transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161616] border border-[#262626] text-[#26d464] shadow-inner">
                <IconSpindle className="w-4 h-4 text-[#26d464]" />
              </span>
              <span>
                EXPEND<span className="text-[#26d464]">RY</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md leading-relaxed text-pretty font-poppins">
              Where experience is never retired. Empowering veteran machinists to
              archive tacit shop-floor wisdom, earn EXPEN rewards on MST
              testnet, inspect 3D tooling geometries, and consult AI-powered machining intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#121212] border border-[#262626] text-xs font-mono text-[#26d464]">
              <span className="h-2 w-2 rounded-full bg-[#f97316]" />
              <span>MST Testnet · Chain ID: {CHAIN_ID} · 0x56F0...283a</span>
            </div>
          </div>

          {/* Core Routes */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-white mb-3">
              Ecosystem Navigation
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">01 //</span>
                  <span>About & Manifesto</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/agent"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">02 //</span>
                  <span>AI Machining Assistant</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">03 //</span>
                  <span>Tooling Marketplace</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">04 //</span>
                  <span>Machinist Experience Hub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blueprints"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">05 //</span>
                  <span>Engineering Blueprints</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/patent"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">06 //</span>
                  <span>Decentralized Patents</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="hover:text-[#26d464] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-zinc-400 font-mono">07 //</span>
                  <span>Partners & Investors</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Blockchain */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-white mb-3">
              Network & Verification
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#26d464] transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <span>MSTScan Blockchain Explorer</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://testnetfaucet.mstblockchain.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#26d464] transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <span>MST Testnet Faucet</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <div className="p-2.5 rounded-lg bg-[#121212] border border-[#222222] text-[11px] font-mono text-[#a1a1aa] mt-2 space-y-1">
                  <div className="text-white font-semibold">TOKENOMICS RULE:</div>
                  <div>{REWARD_PER_POST} EXPEN / Valid Post</div>
                  <div className="text-[#26d464]">{DAILY_CAP} EXPEN Daily Cap / Wallet</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Shop-Floor Terminal Signoff */}
        <div className="border-t border-[#1c1c1c] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#a1a1aa] gap-4">
          <p>© 2026 Expendry Ecosystem. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Engineered for veteran machinists and high-precision CNC tooling. MST Blockchain Testnet Chain ID {CHAIN_ID}.
          </p>
        </div>
      </div>
    </footer>
  );
}
