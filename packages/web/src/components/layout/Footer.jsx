"use client";

import React from "react";
import Link from "next/link";
import { EXPLORER_URL, CHAIN_ID } from "shared/constants";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      aria-label="Site footer"
      className="footer-container bg-black text-white relative overflow-hidden select-none"
    >
      {/* 1. Top Emerald Accent Strip */}
      <div
        className="footer-top-strip w-full h-1.5 bg-[#16a34a]"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-8">
        {/* 2. Upper 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: PLATFORM */}
          <div className="col-span-1 md:col-span-4 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              PLATFORM
            </h2>
            <nav aria-label="Platform Links" className="space-y-1.5">
              <div>
                <Link
                  href="/"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/about"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  About
                </Link>
              </div>
              <div>
                <Link
                  href="/heritage"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Biorad Heritage
                </Link>
              </div>
              <div>
                <Link
                  href="/marketplace"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  3D Marketplace
                </Link>
              </div>
              <div>
                <Link
                  href="/agent"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Sarvam AI Agent
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 2: ENGINEERING */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              ENGINEERING
            </h2>
            <nav aria-label="Engineering Links" className="space-y-1.5">
              <div>
                <Link
                  href="/blueprints"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Blueprints
                </Link>
              </div>
              <div>
                <Link
                  href="/experience"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Experience
                </Link>
              </div>
              <div>
                <Link
                  href="/patent"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Patents
                </Link>
              </div>
              <div>
                <Link
                  href="/partners"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Partners
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 3: ECOSYSTEM & COMPLIANCE */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              ECOSYSTEM &amp; LEGAL
            </h2>
            <div className="space-y-1.5">
              <div>
                <Link
                  href="/privacy"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/terms"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Terms of Service
                </Link>
              </div>
              <div>
                <a
                  href="https://www.bioradmedisys.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  Biorad Medisys Pune ↗
                </a>
              </div>
              <div>
                <a
                  href="https://bridgekey.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  BridgeKey Wallet ↗
                </a>
              </div>
              <div>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-sm sm:text-base font-normal text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  MSTScan Explorer ↗
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: CONTACT & SHOP-FLOOR */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              SHOP-FLOOR
            </h2>
            <div className="space-y-1 text-xs sm:text-sm text-zinc-400 font-mono">
              <div>
                <a
                  href="mailto:info@expendry.io"
                  className="footer-nav-link text-zinc-300 hover:text-[#16a34a] transition-colors leading-tight inline-block"
                >
                  info@expendry.io
                </a>
              </div>
              <p className="text-zinc-500 pt-1">
                Precision Cluster, Pune, MH, India
              </p>
            </div>
          </div>
        </div>

        {/* 3. Hairline Dotted Divider Line */}
        <div
          className="footer-dotted-divider w-full border-b border-dotted border-zinc-800 my-8"
          aria-hidden="true"
        />

        {/* 4. Zoomed-In Hero Wordmark Statement (High-Impact Machining Green) */}
        <div className="w-full overflow-hidden select-none py-2 sm:py-4 flex items-center justify-center">
          <div className="footer-hero-wordmark font-montserrat font-black tracking-tighter text-[#16a34a] leading-none whitespace-nowrap text-5xl sm:text-7xl md:text-8xl lg:text-[11vw] flex items-baseline justify-center hover:scale-[1.01] transition-transform duration-300">
            <span className="opacity-95 hover:opacity-100 transition-opacity relative">
              expendry
              <sup
                className="text-[0.22em] font-normal text-zinc-500 align-super ml-1 sm:ml-2"
                aria-label="Registered trademark"
              >
                ®
              </sup>
            </span>
          </div>
        </div>

        {/* 5. Bottom Signoff Bar */}
        <div className="footer-bottom-bar border-t border-zinc-900 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-mono gap-4">
          {/* Left: Location */}
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#16a34a]"
              aria-hidden="true"
            />
            <span className="text-zinc-400">Pune Engineering Cluster, MH, IN</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">
              MST-Testnet #{CHAIN_ID}
            </span>
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-zinc-400 font-sans">
            © 2026 Expendry Ecosystem. All Rights Reserved.
          </div>

          {/* Right: Back to top smooth scroller */}
          <button
            type="button"
            onClick={scrollToTop}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 group font-sans focus:outline-none focus:ring-1 focus:ring-[#16a34a] rounded px-1"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 text-[#16a34a]"
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
