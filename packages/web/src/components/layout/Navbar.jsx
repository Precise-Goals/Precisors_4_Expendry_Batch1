"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CHAIN_ID } from "shared/constants";
import { IconSpindle } from "@/components/ui/Icons";

export const NAV_LINKS = [
  { href: "/", label: "Home", num: "00" },
  { href: "/about", label: "About", num: "01" },
  { href: "/agent", label: "Agent", num: "02" },
  { href: "/marketplace", label: "Marketplace", num: "03" },
  { href: "/experience", label: "Experience", num: "04" },
  { href: "/blueprints", label: "Blueprints", num: "05" },
  { href: "/patent", label: "Patent", num: "06" },
  { href: "/partners", label: "Partners", num: "07" },
];

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  // Close mobile menu on pathname change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/92 backdrop-blur-xl border-b border-[#262626] shadow-xl shadow-black/60"
          : "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]"
      }`}
    >
      {/* Top Telemetry Strip */}
      <div className="w-full bg-[#080808]/90 border-b border-[#1c1c1c] text-[10px] font-mono text-[#a1a1aa] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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
          <span className="text-[#38bdf8]/80">SYS // PRECISION CNC</span>
          <span className="text-zinc-700">|</span>
          <span>[REF: 18.5204°N, 73.8567°E]</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Chamfered Industrial Box */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-[#ededed] hover:text-[#26d464] transition-colors font-montserrat"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161616] border border-[#262626] text-[#26d464] shadow-inner">
              <IconSpindle className="w-4 h-4 text-[#26d464]" />
            </span>
            <span className="tracking-wider">
              EXPEND<span className="text-[#26d464]">RY</span>
            </span>
          </Link>
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono text-[#a1a1aa] bg-[#121212] border border-[#262626]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            MST 91562037
          </span>
        </div>

        {/* Desktop Navigation: Segmented CNC Controller Channel Dock with Fluid Spring Morphing */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-0.5 p-1 rounded-xl bg-[#121212]/90 border border-[#262626] shadow-inner relative"
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
                className={`relative px-2.5 py-1 text-xs font-medium rounded-lg transition-colors duration-150 flex items-center z-10 ${
                  isActive
                    ? "text-[#ededed] font-semibold"
                    : "text-[#a1a1aa] hover:text-[#ededed]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={shouldReduceMotion ? undefined : "activeNavPill"}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="absolute inset-0 bg-[#1c1c1c] border border-white/[0.09] rounded-lg shadow-sm -z-10"
                  />
                )}
                {link.num && (
                  <span className="font-mono text-[9px] text-zinc-500 mr-1">
                    {link.num}
                  </span>
                )}
                <span>{link.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 bg-[#26d464] rounded-full shadow-[0_0_8px_rgba(38,212,100,0.6)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Wallet Connect CTA with live beacon */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#161616] text-[#ededed] border border-[#262626] hover:border-[#26d464]/60 hover:bg-[#1c1c1c] active:scale-[0.97] transition-all duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] group"
          >
            <span className="h-2 w-2 rounded-full bg-[#26d464] shadow-[0_0_8px_#26d464] animate-pulse" />
            <span>Connect Wallet</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex xl:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-[#a1a1aa] hover:bg-[#161616] hover:text-[#ededed] focus:outline-none focus:ring-2 focus:ring-[#26d464]"
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

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="xl:hidden border-b border-[#262626] bg-[#0a0a0a]/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1"
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#26d464] bg-[#26d464]/10 font-semibold"
                    : "text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#161616]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.num && (
                    <span className="font-mono text-xs text-zinc-500">
                      {link.num}
                    </span>
                  )}
                  <span>{link.label}</span>
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#26d464]" />
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-lg bg-[#26d464] text-black font-montserrat font-bold shadow-md active:scale-98"
            >
              <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span>Connect Wallet & Onboard</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
