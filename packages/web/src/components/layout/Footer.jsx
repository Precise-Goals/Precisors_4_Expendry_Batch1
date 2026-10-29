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
      {/* 1. Top Gray Accent Strip (matches reference image) */}
      <div
        className="footer-top-strip w-full h-3 sm:h-3.5 bg-zinc-300"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-8">
        {/* 2. Upper 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start">
          {/* Column 1: LINKS */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              LINKS
            </h2>
            <nav aria-label="Footer Navigation Links" className="space-y-1.5">
              <div>
                <Link
                  href="/"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/about"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  About
                </Link>
              </div>
              <div>
                <Link
                  href="/marketplace"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Marketplace
                </Link>
              </div>
              <div>
                <Link
                  href="/experience"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Experience
                </Link>
              </div>
              <div>
                <Link
                  href="/blueprints"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Blueprints
                </Link>
              </div>
              <div>
                <Link
                  href="/patent"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Patents
                </Link>
              </div>
            </nav>
          </div>

          {/* Column 2: CONNECT */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              CONNECT
            </h2>
            <div className="space-y-1.5">
              <div>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  X
                </a>
              </div>
              <div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Linked In
                </a>
              </div>
              <div>
                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  MSTScan
                </a>
              </div>
              <div>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link text-lg sm:text-2xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: CONTACT */}
          <div className="md:col-span-3 space-y-4 md:text-right">
            <h2 className="footer-nav-label text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              CONTACT
            </h2>
            <div>
              <a
                href="mailto:info@expendry.io"
                className="footer-nav-link text-base sm:text-xl font-normal text-white hover:text-[#26d464] transition-colors leading-tight inline-block"
              >
                info[at]expendry.io
              </a>
            </div>
          </div>
        </div>

        {/* 3. Hairline Dotted Divider Line (matches reference image) */}
        <div
          className="footer-dotted-divider w-full border-b border-dotted border-zinc-700/60 my-10 sm:my-14"
          aria-hidden="true"
        />

        {/* 4. Massive Panoramic Wordmark Statement */}
        <div className="w-full overflow-hidden select-none py-2 my-2 flex items-center justify-center">
          <div className="footer-hero-wordmark font-montserrat font-extrabold tracking-tighter text-zinc-300 leading-none whitespace-nowrap text-[12vw] sm:text-[13vw] flex items-baseline justify-center">
            <span className="opacity-90 hover:opacity-100 transition-opacity">
              expendry
            </span>
            <span className="mx-2 sm:mx-4 opacity-90 hover:opacity-100 transition-opacity relative">
              expendry
              <sup
                className="text-[0.22em] font-normal text-zinc-400 align-super ml-0.5 sm:ml-1"
                aria-label="Registered trademark"
              >
                ®
              </sup>
            </span>
            <span className="opacity-90 hover:opacity-100 transition-opacity">
              expendry<span className="text-[#26d464]">.</span>
            </span>
          </div>
        </div>

        {/* 5. Authentic Industrial / Garment Care Label Stamp */}
        <div className="footer-care-stamp my-10 sm:my-12 flex flex-col items-center justify-center text-center space-y-1.5">
          <p className="footer-care-heading text-xs sm:text-sm font-normal text-zinc-400 tracking-wide font-sans">
            Handled with
          </p>
          <p className="footer-care-title text-sm sm:text-base font-bold text-white tracking-[0.16em] uppercase font-sans">
            100% TACIT WISDOM
          </p>

          {/* Care Symbol Glyphs Row */}
          <div
            className="footer-care-icons-row flex items-center justify-center gap-3 sm:gap-4 my-2 text-zinc-300"
            aria-label="Manufacturing Care Symbols"
          >
            {/* (A) Circle A */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 17l4-10 4 10" />
              <path d="M9.5 13.5h5" />
            </svg>

            {/* Crossed square / tumble dry care icon */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="12" r="6" />
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>

            {/* Wash tub with 30 */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8h18l-2 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 8z" />
              <path d="M3 11c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
              <text
                x="12"
                y="17.2"
                textAnchor="middle"
                fontSize="6"
                fontWeight="bold"
                fill="currentColor"
                stroke="none"
              >
                30
              </text>
            </svg>

            {/* Iron / Care press symbol */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 17h16a2 2 0 0 0 2-2c0-4-3-7-7-7H8l-4 9z" />
              <line x1="4" y1="17" x2="22" y2="17" />
            </svg>

            {/* T-Shirt Garment Outline */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 4L3 8l3 3 2-2v11h8V9l2 2 3-3-4-4c-1.5 2-4.5 2-6 0z" />
            </svg>

            {/* (A) Circle A */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 17l4-10 4 10" />
              <path d="M9.5 13.5h5" />
            </svg>
          </div>

          <p className="footer-care-heading text-xs sm:text-sm font-normal text-zinc-400 tracking-wide font-sans">
            Designed and
          </p>
          <p className="footer-care-title text-sm sm:text-base font-bold text-white tracking-[0.16em] uppercase font-sans">
            MANUFACTURED IN
          </p>
          <p className="footer-care-footer text-xs sm:text-sm font-medium text-zinc-400 tracking-[0.18em] uppercase font-sans">
            PUNE & MIDC BHOSARI, INDIA
          </p>
        </div>

        {/* 6. Bottom Signoff Bar (matches reference image) */}
        <div className="footer-bottom-bar pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-[13px] text-zinc-400 font-sans gap-4">
          {/* Left: Location with subtle active green/orange status */}
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
