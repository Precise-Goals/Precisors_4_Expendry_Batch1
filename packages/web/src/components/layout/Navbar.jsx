"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CHAIN_ID } from "shared/constants";

export const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/agent", label: "AGENT" },
  { href: "/marketplace", label: "MARKETPLACE" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/blueprints", label: "BLUEPRINTS" },
  { href: "/patent", label: "PATENT" },
  { href: "/partners", label: "PARTNERS" },
];

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Close mobile menu on pathname change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#050505] transition-colors duration-300 ${
        isScrolled
          ? "bg-[#050505]/98 backdrop-blur-xl shadow-2xl shadow-black/80"
          : "bg-[#050505]"
      }`}
    >
      {/* Top Telemetry Strip */}
      <div className="w-full bg-[#020202] border-b border-[#181818] text-[10px] font-mono text-[#a1a1aa] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 text-[#26d464]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
            MST-{CHAIN_ID}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-[#38bdf8] hidden xs:inline font-mono">LATHE HUD</span>
          <span className="text-zinc-600 hidden xs:inline">·</span>
          <span>EXPEN ERC-20</span>
          <span className="text-zinc-600">·</span>
          <span className="text-[#26d464] font-semibold">ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
          <span className="text-[#38bdf8]/80">SYS // PRECISION INDUSTRIAL</span>
          <span className="text-zinc-700">|</span>
          <span>[REF: 18.5204°N, 73.8567°E]</span>
        </div>
      </div>

      {/* Main Architectural Grid Navbar Bar */}
      <div className="relative border-b border-[#222222] h-18 flex items-stretch justify-between">
        {/* ──────────────────────────────────────────────────────────
            1. BRAND SECTION (Framed with vertical hairlines + crosshair ticks)
           ────────────────────────────────────────────────────────── */}
        <div className="relative border-r border-[#222222] px-6 sm:px-8 flex items-center shrink-0">
          {/* Left Border Crosshair (+) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 font-mono text-[11px] leading-none text-zinc-500 pointer-events-none select-none z-20"
          >
            +
          </span>

          {/* Right Border Crosshair (+) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 font-mono text-[11px] leading-none text-zinc-500 pointer-events-none select-none z-20"
          >
            +
          </span>

          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#26d464]"
            aria-label="Expendry Home"
          >
            {/* Geometric Multi-Faceted Woven Emblem matching reference architecture */}
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
                aria-hidden="true"
              >
                {/* 4 Precision Faceted Geometric Polygons */}
                <path d="M5 12L13 4H21L13 12H5Z" fill="#ededed" />
                <path d="M21 4L27 10V18L21 12V4Z" fill="#ededed" />
                <path d="M27 20L19 28H11L19 20H27Z" fill="#ededed" />
                <path d="M11 28L5 22V14L11 20V28Z" fill="#26d464" />
              </svg>
            </div>

            {/* Stacked Two-Line Brand Name */}
            <div className="flex flex-col font-montserrat font-black text-[13px] tracking-[0.18em] leading-[1.05] text-white">
              <span className="group-hover:text-white transition-colors">EXPEND</span>
              <span className="text-[#26d464] group-hover:text-[#21b856] transition-colors">RY</span>
            </div>
          </Link>
        </div>

        {/* ──────────────────────────────────────────────────────────
            2. NAVIGATION LINKS (Center-Spanning Space)
           ────────────────────────────────────────────────────────── */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex flex-1 items-center justify-center gap-7 2xl:gap-9 px-6"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-2 text-xs font-montserrat font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-[#8e8e93] hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : "activeNavbarDot"}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#26d464] shadow-[0_0_8px_#26d464]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ──────────────────────────────────────────────────────────
            3. RIGHT CTA SECTION (Flanked by vertical hairlines + crosshair ticks)
           ────────────────────────────────────────────────────────── */}
        <div className="relative border-l border-r border-[#222222] px-6 sm:px-8 lg:px-10 flex items-center shrink-0">
          {/* Left Border Crosshair (+) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 font-mono text-[11px] leading-none text-zinc-500 pointer-events-none select-none z-20"
          >
            +
          </span>

          {/* Right Border Crosshair (+) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 font-mono text-[11px] leading-none text-zinc-500 pointer-events-none select-none z-20"
          >
            +
          </span>

          <Link
            href="/onboarding"
            className="group flex items-center justify-between gap-8 sm:gap-12 lg:gap-14 text-xs font-montserrat font-bold uppercase tracking-[0.18em] text-white hover:text-[#26d464] transition-colors duration-200 select-none py-2"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] shadow-[0_0_8px_#26d464] animate-pulse" />
              <span>CONNECT WALLET</span>
            </div>
            <span
              aria-hidden="true"
              className="font-mono text-sm text-[#ededed] group-hover:text-[#26d464] group-hover:translate-x-1.5 transition-all duration-200"
            >
              →
            </span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden ml-4 pl-3 border-l border-[#222222]">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center p-2 text-[#a1a1aa] hover:text-white focus:outline-none"
            >
              <span className="sr-only">Toggle navigation menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. MOBILE NAVIGATION DRAWER
         ────────────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="xl:hidden border-b border-[#222222] bg-[#050505] px-6 py-6 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-[#1c1c1c]">
            {NAV_LINKS.map((link, idx) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-montserrat font-bold tracking-[0.14em] transition-colors ${
                    isActive
                      ? "text-[#26d464] bg-[#26d464]/10 border border-[#26d464]/30"
                      : "text-[#a1a1aa] hover:text-white bg-[#0e0e0e] border border-[#222222]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] text-zinc-600">0{idx}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/onboarding"
              className="flex items-center justify-between w-full py-3 px-5 rounded-lg bg-[#121212] border border-[#262626] hover:border-[#26d464] text-xs font-montserrat font-bold tracking-[0.16em] text-white group transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
                <span>CONNECT WALLET</span>
              </div>
              <span className="font-mono text-sm text-[#26d464] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
