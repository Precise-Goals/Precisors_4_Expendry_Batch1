"use client";

import React from "react";
import Link from "next/link";
import { IconExternal } from "@/components/ui/Icons";
import { EXPLORER_URL, CHAIN_ID } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      aria-label="Site footer"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6 select-none relative"
    >
      {/* Floating Island White Container */}
      <div className="footer-container relative rounded-4xl bg-white border border-zinc-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-8 sm:p-12 lg:p-16">
        {/* Top Radiant Gradient Accent Strip */}
        <div
          className="footer-top-strip absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700"
          aria-hidden="true"
        />

        {/* Upper 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: PLATFORM */}
          <div className="col-span-1 md:col-span-4 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">
              PLATFORM
            </h2>
            <nav aria-label="Platform Links" className="space-y-2">
              <div>
                <Link
                  href="/"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/about"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  About
                </Link>
              </div>
              <div>
                <Link
                  href="/heritage"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Biorad Heritage
                </Link>
              </div>
              <div>
                <Link
                  href="/marketplace"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  3D Marketplace
                </Link>
              </div>
              <div>
                <Link
                  href="/chat"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Expendry AI Pulse
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 2: ENGINEERING */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">
              ENGINEERING
            </h2>
            <nav aria-label="Engineering Links" className="space-y-2">
              <div>
                <Link
                  href="/blueprints"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Blueprints
                </Link>
              </div>
              <div>
                <Link
                  href="/experience"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Experience
                </Link>
              </div>
              <div>
                <Link
                  href="/patent"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Patents
                </Link>
              </div>
              <div>
                <Link
                  href="/partners"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Partners
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 3: ECOSYSTEM & COMPLIANCE */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">
              ECOSYSTEM &amp; LEGAL
            </h2>
            <div className="space-y-2">
              <div>
                <Link
                  href="/privacy"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/terms"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-block"
                >
                  Terms of Service
                </Link>
              </div>
              <div>
                <a
                  href="https://www.bioradmedisys.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-flex items-center gap-1.5"
                >
                  <span>Biorad Medisys Pune</span>
                  <IconExternal className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
              <div>
                <a
                  href="https://bridgekey.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-flex items-center gap-1.5"
                >
                  <span>BridgeKey Wallet</span>
                  <IconExternal className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
              <div>
                <a
                  href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-bold text-emerald-800 hover:text-emerald-950 transition-colors leading-tight inline-flex items-center gap-1.5"
                >
                  <span>EXPEN Contract (MSTScan)</span>
                  <IconExternal className="w-3.5 h-3.5 text-emerald-700" />
                </a>
              </div>
              <div>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-medium text-zinc-600 hover:text-emerald-700 transition-colors leading-tight inline-flex items-center gap-1.5"
                >
                  <span>MSTScan Explorer</span>
                  <IconExternal className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: CONTACT & SHOP-FLOOR */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">
              SHOP-FLOOR
            </h2>
            <div className="space-y-1.5 text-xs sm:text-sm text-zinc-600 font-mono">
              <div>
                <a
                  href="mailto:info@expendry.io"
                  className="footer-nav-link text-zinc-800 hover:text-emerald-700 font-bold transition-colors leading-tight inline-block"
                >
                  info@expendry.io
                </a>
              </div>
              <p className="text-zinc-500 pt-1 leading-relaxed">
                Precision Cluster, Pune, MH, India
              </p>
            </div>
          </div>
        </div>

        {/* Radiant Gradient Separator */}
        <div
          className="footer-gradient-divider w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-10"
          aria-hidden="true"
        />

        {/* Monumental Hero Wordmark Statement with Radiant Background-Clip Gradient */}
        <div className="w-full overflow-hidden select-none py-4 sm:py-6 flex items-center justify-center">
          <div className="footer-hero-wordmark font-montserrat font-black tracking-tighter leading-none whitespace-nowrap text-5xl sm:text-7xl md:text-8xl lg:text-[11vw] flex items-baseline justify-center hover:scale-[1.01] transition-transform duration-300">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 via-teal-600 to-zinc-900 relative">
              expendry
              <sup
                className="text-[0.22em] font-extrabold text-emerald-600 align-super ml-1 sm:ml-2"
                aria-label="Registered trademark"
              >
                ®
              </sup>
            </span>
          </div>
        </div>

        {/* Bottom Signoff Bar */}
        <div className="footer-bottom-bar border-t border-zinc-100 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
          {/* Left: Location & Verified Chain */}
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-zinc-600 font-medium">Pune Engineering Cluster, MH, IN</span>
            <span className="text-zinc-300">·</span>
            <a
              href={`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-800 font-bold hover:underline"
            >
              MST-Testnet #{CHAIN_ID}
            </a>
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-zinc-500 font-sans">
            © 2026 Expendry Ecosystem. All Rights Reserved.
          </div>

          {/* Right: Tactile Back to Top Liquid Glass Pill */}
          <button
            type="button"
            onClick={scrollToTop}
            className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 text-xs font-mono font-bold transition shadow-2xs active:scale-95 cursor-pointer inline-flex items-center gap-1.5 group"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 text-emerald-700"
              aria-hidden="true"
            >
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
