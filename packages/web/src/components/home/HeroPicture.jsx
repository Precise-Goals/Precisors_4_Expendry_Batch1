"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * HeroPicture — High-Fidelity Precision Medical & Industrial CNC Showcase
 * Employs Emil Kowalski spring-physics motion, CMM inspection reticles,
 * and contextual telemetry chips for the Expendry hero section.
 */
export default function HeroPicture() {
  const shouldReduceMotion = useSafeReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center select-none">
      {/* Ambient Radial Glow around picture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 bg-gradient-to-tr from-[#16a34a]/15 via-emerald-500/10 to-teal-400/5 rounded-3xl blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Main Picture Frame */}
      <motion.figure
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: shouldReduceMotion ? 1000 : 260,
          damping: shouldReduceMotion ? 100 : 24,
        }}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                scale: 1.012,
                y: -3,
                transition: { type: "spring", stiffness: 350, damping: 20 },
              }
        }
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative w-full rounded-2xl sm:rounded-3xl liquid-glass border-2 border-emerald-600 shadow-2xl shadow-emerald-950/10 overflow-hidden cursor-crosshair transition-shadow duration-300 hover:shadow-emerald-500/20"
      >
        {/* Reticle / Optical Comparator Corner Marks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 p-3 sm:p-4 flex flex-col justify-between"
        >
          {/* Top Reticles */}
          <div className="flex justify-between items-center text-zinc-400/80 font-mono text-[10px]">
            <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-200 shadow-sm text-zinc-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span>CMM-CAM // ACTIVE</span>
            </span>
            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-200 shadow-sm text-zinc-600">
              FRAME: 1672×941 RAW
            </span>
          </div>

          {/* Bottom Reticles */}
          <div className="flex justify-between items-center text-zinc-500 font-mono text-[10px]">
            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-200 shadow-sm text-zinc-600">
              SCALE: 1:1 TRUE BIOMECH
            </span>
            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-200 shadow-sm text-[#16a34a] font-bold">
              EXPEN VERIFIED
            </span>
          </div>
        </div>

        {/* High-Resolution Hero Picture */}
        <div className="relative w-full aspect-[1672/941] bg-zinc-50 overflow-hidden">
          <Image
            src="/images/h.png"
            alt="High-precision 5-axis CNC machined titanium medical implants and biomechanical joint scan on workshop inspection table"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 640px"
            priority
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />

          {/* Subtle Dynamic Specular Sheen Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"
          />
        </div>

        {/* Floating Telemetry Chips */}
        <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 z-20 flex flex-wrap gap-2 max-w-[90%]">
          {/* Specimen Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass-pill border border-emerald-600/40 shadow-lg text-xs font-mono text-zinc-950 font-bold">
            <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-ping" />
            <span className="font-bold text-[#16a34a]">Ti-6Al-4V ELI</span>
            <span className="text-zinc-600 font-bold">|</span>
            <span className="text-zinc-700">5-Axis Orthopedic Joint</span>
          </div>

          {/* Tolerance Tag */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-lg text-xs font-mono text-white">
            <span className="text-[#26d464] font-bold">±0.002 mm</span>
            <span className="text-zinc-300 font-medium">Tolerance Checked</span>
          </div>
        </div>

        <figcaption className="sr-only">
          Expendry High-Precision 5-Axis CNC Machining Hero Showcase: Titanium orthopedic implants, knee replacement prosthetics, and digital twin telemetry.
        </figcaption>
      </motion.figure>
    </div>
  );
}
