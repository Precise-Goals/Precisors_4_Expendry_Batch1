"use client";

import React from "react";

export default function AmbientCanvas({ children }) {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Fixed Ambient Background Canvas with Authentic Brand Luminous Refraction */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Crisp Base */}
        <div className="absolute inset-0 bg-[#ffffff]" />

        {/* Precision 24px CAD Millimeter Dot-Grid */}
        <div className="absolute inset-0 cad-dot-grid opacity-70" />

        {/* Primary Ambient Emerald Glow Orb (Upper Left/Center Behind Navbar & Hero) */}
        <div
          className="absolute -top-32 -left-16 w-[720px] h-[720px] rounded-full ambient-glow-emerald opacity-100 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />

        {/* Warm Subtle Amber Aura (Upper Right Header Accent) */}
        <div
          className="absolute -top-20 right-10 w-[500px] h-[500px] rounded-full ambient-glow-amber opacity-90 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />

        {/* Secondary Atmospheric Mint/Cyan Glow Orb (Mid-Right Behind Cards) */}
        <div
          className="absolute top-[32%] -right-20 w-[640px] h-[640px] rounded-full ambient-glow-mint opacity-95 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />

        {/* Tertiary Ambient Emerald Glow Orb (Lower Floor Behind Footer & Blueprint Specs) */}
        <div
          className="absolute -bottom-40 left-[10%] w-[780px] h-[780px] rounded-full ambient-glow-emerald opacity-90 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />
      </div>

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
        {children}
      </div>
    </div>
  );
}
