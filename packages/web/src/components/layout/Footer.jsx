import React from "react";
import Link from "next/link";
import { EXPLORER_URL, CHAIN_ID } from "shared/constants";

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-[#262626] bg-[#070707] text-[#a1a1aa]"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#ededed] font-display hover:text-[#26d464] transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161616] border border-[#262626] text-[#26d464]">
                ⚙️
              </span>
              <span>
                EXPEND<span className="text-[#26d464]">RY</span>
              </span>
            </Link>
            <p className="text-sm text-[#a1a1aa] max-w-md leading-relaxed">
              Where experience is never retired. Empowering veteran machinists to
              archive tacit shop-floor knowledge, earn EXPEN rewards on MST
              testnet, and consult AI-powered tooling intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs text-[#26d464]">
              <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
              <span>MST Testnet (Chain ID: {CHAIN_ID})</span>
            </div>
          </div>

          {/* Core Routes */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#ededed] mb-3 font-display">
              Ecosystem
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="hover:text-[#26d464] transition-colors"
                >
                  Community Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/agent"
                  className="hover:text-[#26d464] transition-colors"
                >
                  Sarvam AI Agent
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-[#26d464] transition-colors"
                >
                  Tooling & 3D Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className="hover:text-[#26d464] transition-colors"
                >
                  Wallet Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Blockchain */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#ededed] mb-3 font-display">
              Resources
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#26d464] transition-colors inline-flex items-center gap-1"
                >
                  MSTScan Explorer
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://testnetfaucet.mstblockchain.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#26d464] transition-colors inline-flex items-center gap-1"
                >
                  MST Faucet
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <span className="text-xs text-[#71717a]">
                  50 EXPEN Daily Cap / 10 EXPEN per Post
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1c1c1c] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] gap-4">
          <p>© 2026 Expendry Ecosystem. All rights reserved.</p>
          <p className="text-xs">
            Built for veteran machinists and high-precision CNC tooling.
          </p>
        </div>
      </div>
    </footer>
  );
}
