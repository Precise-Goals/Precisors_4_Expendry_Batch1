"use client";

import React from "react";

export default function AmbientCanvas({ children }) {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Fixed Ambient Background Canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Stark White Base */}
        <div className="absolute inset-0 bg-white" />

        {/* Precision 24px CAD Millimeter Dot-Grid */}
        <div className="absolute inset-0 cad-dot-grid opacity-65" />

        {/* Primary Ambient Emerald Glow Orb (Upper Left/Center) */}
        <div
          className="absolute -top-40 -left-20 w-[680px] h-[680px] rounded-full ambient-glow-emerald opacity-90 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />

        {/* Secondary Atmospheric Mint/Cyan Glow Orb (Mid-Right) */}
        <div
          className="absolute top-[35%] -right-24 w-[600px] h-[600px] rounded-full ambient-glow-mint opacity-80 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />

        {/* Tertiary Ambient Emerald Glow Orb (Lower Floor) */}
        <div
          className="absolute -bottom-48 left-[15%] w-[720px] h-[720px] rounded-full ambient-glow-emerald opacity-75 transition-transform duration-1000 ease-out"
          style={{ transform: "translate3d(0, 0, 0)" }}
        />
      </div>

      {/* Foreground Content Stack */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
