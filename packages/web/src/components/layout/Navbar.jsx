"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { IconSpindle } from "@/components/ui/Icons";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/heritage", label: "Heritage" },
  { href: "/agent", label: "Agent" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/experience", label: "Experience" },
  { href: "/blueprints", label: "Blueprints" },
  { href: "/patent", label: "Patent" },
  { href: "/partners", label: "Partners" },
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
          ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#262626] shadow-xl shadow-black/70"
          : "bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/[0.08]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-white hover:text-[#26d464] transition-colors font-montserrat"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161616] border border-[#262626] text-[#26d464] shadow-inner">
              <IconSpindle className="w-4 h-4 text-[#26d464]" />
            </span>
            <span className="tracking-wider">
              EXPEND<span className="text-[#26d464]">RY</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-[#121212]/90 border border-[#262626] shadow-inner relative"
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
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 flex items-center z-10 ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-[#a1a1aa] hover:text-white"
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
                    className="absolute inset-0 bg-[#1c1c1c] border border-white/[0.12] rounded-lg shadow-sm -z-10"
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button: Sign In */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#26d464] hover:bg-[#21b856] text-black text-xs font-montserrat font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
            <span>Sign In</span>
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
            className="inline-flex items-center justify-center rounded-md p-2 text-[#a1a1aa] hover:bg-[#161616] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#26d464]"
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
                    : "text-[#a1a1aa] hover:text-white hover:bg-[#161616]"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#26d464]" />
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-lg bg-[#26d464] text-black font-montserrat font-bold shadow-md active:scale-98"
            >
              <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span>Sign In</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
