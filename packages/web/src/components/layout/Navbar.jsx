"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Feed" },
  { href: "/marketplace", label: "3D Market" },
  { href: "/blueprints", label: "Blueprints" },
  { href: "/experience", label: "Tacit Audio" },
  { href: "/showcase", label: "3D CAD" },
  { href: "/chat", label: "AI Pulse" },
  { href: "/heritage", label: "Heritage" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useSafeReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll offset to adjust elevation
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

  // Close mobile menu on pathname change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-5xl transition-all duration-300">
      {/* Liquid Glass Detached Capsule */}
      <div
        className={`relative flex h-14 sm:h-16 items-center justify-between px-3 sm:px-5 rounded-full liquid-glass-pill ring-1 ring-zinc-900/5 transition-all duration-300 ${
          isScrolled
            ? "shadow-2xl border-white/80"
            : "shadow-lg border-white/60"
        }`}
      >
        {/* Brand Logo with logo1to1.png short icon */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-base sm:text-lg font-black tracking-tight text-zinc-950 hover:text-emerald-700 transition-colors font-montserrat"
            aria-label="Expendry Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden bg-white/90 border border-emerald-200/90 shadow-2xs shrink-0 p-0.5">
              <img
                src="/logo1to1.png"
                alt="Expendry Short Icon"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </span>
            <span className="tracking-wider">
              EXPEND<span className="text-emerald-700">RY</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-0.5 p-1 rounded-full bg-zinc-100/80 backdrop-blur-md border border-zinc-200/80 shadow-2xs relative"
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
                className={`relative px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-150 flex items-center z-10 ${
                  isActive
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-700 hover:text-zinc-950 font-medium"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={shouldReduceMotion ? undefined : "activeNavPill"}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                    className="absolute inset-0 bg-white/95 border border-zinc-200/90 rounded-full shadow-2xs -z-10"
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Sign In Only */}
        <div className="hidden sm:flex items-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-montserrat font-bold transition shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <span>Sign In</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex xl:hidden items-center gap-2">
          <Link
            href="/login"
            className="sm:hidden px-3 py-1.5 rounded-full bg-emerald-800 text-white text-xs font-bold font-montserrat shadow-sm"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center rounded-full p-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition cursor-pointer min-w-[44px] min-h-[44px]"
          >
            <span className="sr-only">Toggle navigation menu</span>
            {isMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer: Floating High-Radius Liquid Glass Card */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-nav-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="xl:hidden mt-2 p-4 rounded-3xl liquid-glass border border-zinc-200/90 shadow-2xl space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto"
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
                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                    isActive
                      ? "text-emerald-800 bg-emerald-50/90 font-bold border border-emerald-200/80"
                      : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/80"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  )}
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-montserrat shadow-md active:scale-98"
              >
                <span>Sign In to Expendry</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
