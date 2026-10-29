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
      className="footer-container bg-[#000000] text-white relative overflow-hidden select-none"
    >
      {/* 1. Top Gray Accent Strip */}
      <div
        className="footer-top-strip w-full h-2 bg-zinc-300"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10 pb-6">
        {/* 2. Upper 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-start">
          {/* Column 1: LINKS */}
          <div className="md:col-span-5 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              LINKS
            </h2>
            <nav aria-label="Footer Navigation Links" className="space-y-1">
              <div>
                <Link
                  href="/"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/about"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  About
                </Link>
              </div>
              <div>
                <Link
                  href="/marketplace"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Marketplace
                </Link>
              </div>
              <div>
                <Link
                  href="/experience"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Experience
                </Link>
              </div>
              <div>
                <Link
                  href="/blueprints"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Blueprints
                </Link>
              </div>
              <div>
                <Link
                  href="/patent"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Patents
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 2: CONNECT */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              CONNECT
            </h2>
            <div className="space-y-1">
              <div>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  X
                </a>
              </div>
              <div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Linked In
                </a>
              </div>
              <div>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  MSTScan
                </a>
              </div>
              <div>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: CONTACT */}
          <div className="md:col-span-3 space-y-3 md:text-right">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              CONTACT
            </h2>
            <div>
              <a
                href="mailto:info@expendry.io"
                className="footer-nav-link text-sm sm:text-lg font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
              >
                info[at]expendry.io
              </a>
            </div>
          </div>
        </div>

        {/* 3. Hairline Dotted Divider Line */}
        <div
          className="footer-dotted-divider w-full border-b border-dotted border-zinc-700/60 my-6 sm:my-8"
          aria-hidden="true"
        />

        {/* 4. Zoomed-In Hero Wordmark Statement (High-Impact Machining Green) */}
        <div className="w-full overflow-hidden select-none py-3 sm:py-6 flex items-center justify-center">
          <div className="footer-hero-wordmark font-montserrat font-black tracking-tighter text-[#26d464] leading-none whitespace-nowrap text-6xl sm:text-8xl md:text-9xl lg:text-[12vw] xl:text-[13vw] flex items-baseline justify-center hover:scale-[1.01] transition-transform duration-300">
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
        <div className="footer-bottom-bar border-t border-zinc-900 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-[13px] text-zinc-400 font-sans gap-4">
          {/* Left: Location */}
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#26d464]"
              aria-hidden="true"
            />
            <span className="text-zinc-400">Pune, MH, IN</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] font-mono text-[#f97316]">
              MST-{CHAIN_ID}
            </span>
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-zinc-400">
            ©2026 Expendry. All Rights Reserved.
          </div>

          {/* Right: Back to top smooth scroller */}
          <button
            type="button"
            onClick={scrollToTop}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 group font-sans focus:outline-none focus:ring-1 focus:ring-[#26d464] rounded px-1"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 text-[#26d464]"
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
