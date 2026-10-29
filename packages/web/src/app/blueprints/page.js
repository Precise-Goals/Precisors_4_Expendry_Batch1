"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconBlueprint,
  IconCaliper,
  IconDownload,
  IconLock,
  IconCheck,
  IconEye,
  IconFileCode,
  IconLayers,
  IconCube3D,
} from "@/components/ui/Icons";
import { CHAIN_ID } from "shared/constants";

const BLUEPRINTS = [
  {
    id: "BP-01",
    title: "Hydraulic Quick-Change Vise Jaw System",
    category: "Workholding",
    author: "Frank Kowalski (Warren Tool & Die)",
    format: "STEP · DXF · SolidWorks",
    fileSize: "14.2 MB",
    tolerance: "ISO 2768-mK (±0.01mm)",
    material: "Alloy Steel 4140 + A2 Tool Steel Pins",
    surfaceFinish: "Ra 0.4 µm Ground Datum",
    costExpen: 20,
    downloads: 342,
    description:
      "Rapid jaw-swap geometry for Kurt and 6-inch CNC mill vises. Allows repeatable 30-second workpiece changeovers with sub-0.005mm repeatability without recalibrating work coordinate systems (G54).",
    specs: [
      { key: "Repeatability", value: "≤ 0.005 mm" },
      { key: "Hardness", value: "52-54 HRC" },
      { key: "Fastener Spec", value: "M8 Grade 12.9 SHCS" },
      { key: "Machine Class", value: "3/4/5-Axis Milling Centers" },
    ],
  },
  {
    id: "BP-02",
    title: "Modular Damped Boring Bar with Lead-Shot Chamber",
    category: "Tooling Fixtures",
    author: "Rameshwar Patil (MIDC Bhosari)",
    format: "STEP · IGES · Fusion 360",
    fileSize: "22.8 MB",
    tolerance: "DIN 7168-m (±0.008mm)",
    material: "AISI 4340 Quenched & Tempered",
    surfaceFinish: "Ra 0.2 µm Honed Bore",
    costExpen: 25,
    downloads: 519,
    description:
      "Acoustic chatter dampening internal sleeve drawing. Incorporates a dynamic viscous fluid + lead shot cavity calibrated to neutralize 2,400 Hz harmonic screams during long 5:1 L/D deep-hole turning.",
    specs: [
      { key: "L/D Ratio", value: "Up to 6.5:1 Overhang" },
      { key: "Chamber Volume", value: "48 cm³ Lead Reservoir" },
      { key: "Concentricity", value: "0.003 mm TIR" },
      { key: "Insert Pocket", value: "ISO CNMG 120408" },
    ],
  },
  {
    id: "BP-03",
    title: "High-Pressure Dual-Nozzle Lathe Coolant Ring",
    category: "Coolant Systems",
    author: "Kenji Sato (Nagoya Toolcraft)",
    format: "STEP · STL · DXF",
    fileSize: "8.5 MB",
    tolerance: "ISO 2768-f (±0.05mm)",
    material: "Anodized AlMgSi0.5 / 3D Metal Print",
    surfaceFinish: "Anodized Black 25µm",
    costExpen: 15,
    downloads: 288,
    description:
      "Direct-spindle high pressure (70 bar) fluid manifold directing concentrated coolant jets directly onto the cutting edge chip-breaker, preventing stringy chip nest formation in stainless turning.",
    specs: [
      { key: "Operating Pressure", value: "Up to 70 Bar (1,000 PSI)" },
      { key: "Nozzle Geometry", value: "Dual Venturi 1.8mm" },
      { key: "Port Thread", value: "G 1/4\" BSPP" },
      { key: "Weight", value: "185 grams" },
    ],
  },
  {
    id: "BP-04",
    title: "Self-Centering 3-Jaw Soft Pie Jaws for Thin Rings",
    category: "Workholding",
    author: "Balwant Singh (Ludhiana Precision)",
    format: "DXF · STEP · G-Code",
    fileSize: "11.1 MB",
    tolerance: "ISO 2768-mK (±0.012mm)",
    material: "Ductile Cast Iron GG25 / 6061-T6",
    surfaceFinish: "Machined Serrations 1.5mm x 60°",
    costExpen: 10,
    downloads: 412,
    description:
      "Full-wrap 360-degree pie jaws designed to clamp thin-wall bearing housings without generating 3-lobe distortion or out-of-round ovality during high-speed finishing cuts.",
    specs: [
      { key: "Clamping Wrap", value: "350° Circumferential" },
      { key: "Chuck Mount", value: "Standard 8-inch Kitagawa" },
      { key: "Max RPM", value: "3,500 RPM" },
      { key: "Bore Distortion", value: "< 0.004 mm at 15 kN" },
    ],
  },
  {
    id: "BP-05",
    title: "5-Axis Tombstone Fixture with Zero-Point Studs",
    category: "Tooling Fixtures",
    author: "Marcus Vance (Munich Aerospace)",
    format: "STEP · SolidWorks · Parasolid",
    fileSize: "38.4 MB",
    tolerance: "DIN ISO 13920-BE (±0.005mm)",
    material: "High-Tensile Meehanite Cast Iron",
    surfaceFinish: "Ra 0.1 µm Precision Ground",
    costExpen: 30,
    downloads: 194,
    description:
      "Compact 4-sided horizontal machining center tombstone column with integrated Lang/System 3R zero-point clamping interfaces for simultaneous multi-part aerospace batch machining.",
    specs: [
      { key: "Total Height", value: "450 mm" },
      { key: "Zero-Point Grid", value: "52 mm Pitch Matrix" },
      { key: "Squareness", value: "0.005 mm per 300 mm" },
      { key: "Weight", value: "34 kg" },
    ],
  },
];

export default function BlueprintsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Workholding", "Tooling Fixtures", "Coolant Systems"];

  const filtered = BLUEPRINTS.filter((bp) => {
    const matchesCat = selectedCategory === "All" || bp.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      bp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUnlock = (bp) => {
    setIsUnlocking(true);
    setTimeout(() => {
      setUnlockedIds((prev) => [...prev, bp.id]);
      setIsUnlocking(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#26d464]/30 selection:text-[#ededed] bg-blueprint-grid">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Blueprints Repository
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Blueprints Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#1f1f1f]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20">+ [CAD/CAM // GD&T]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">+ [ISO-2768-mK]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Engineering Blueprints & GD&T CAD Crib</span>
            <span className="text-white/20">•</span>
            <span className="text-xs font-mono text-[#26d464]">MST-91562037</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-display leading-[1.15]">
            Machinist CAD/CAM Blueprints & Tooling Specs
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl">
            Precision engineering files, custom soft-jaw drawings, chatter-damped boring sleeves, and 5-axis workholding fixtures contributed by veteran toolmakers. Every print features verifiable GD&T tolerances and cryptographic provenance.
          </p>

          {/* Quick Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    selectedCategory === cat
                      ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] font-bold"
                      : "bg-[#121212] border-[#262626] text-[#71717a] hover:text-[#ededed]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search drawings by alloy or fixture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#121212] border border-[#262626] text-xs font-mono text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#26d464]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. BLUEPRINT CATALOG GRID
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Blueprint Catalog"
        className="py-12 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((bp) => {
              const isUnlocked = unlockedIds.includes(bp.id);
              return (
                <div
                  key={bp.id}
                  className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 hover:border-[#383838] transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#26d464] font-bold">[{bp.id}]</span>
                      <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2e2e2e] text-[#a1a1aa]">
                        {bp.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#ededed] font-display">
                      {bp.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                      {bp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0e0e0e] border border-[#222222] text-xs font-mono text-[#a1a1aa]">
                      <div>
                        <span className="text-[#71717a] block text-[10px]">TOLERANCE:</span>
                        <span className="text-[#ededed]">{bp.tolerance}</span>
                      </div>
                      <div>
                        <span className="text-[#71717a] block text-[10px]">MATERIAL:</span>
                        <span className="text-[#ededed] truncate block">{bp.material}</span>
                      </div>
                      <div>
                        <span className="text-[#71717a] block text-[10px]">SURFACE:</span>
                        <span className="text-[#26d464]">{bp.surfaceFinish}</span>
                      </div>
                      <div>
                        <span className="text-[#71717a] block text-[10px]">CAD FORMAT:</span>
                        <span className="text-[#ededed] truncate block">{bp.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#1f1f1f] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBlueprint(bp)}
                      className="text-xs font-mono text-[#26d464] hover:underline flex items-center gap-1.5"
                    >
                      <IconEye className="w-4 h-4" />
                      <span>Inspect Drawing GD&T</span>
                    </button>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => alert(`Starting download for ${bp.title} (${bp.format})`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26d464]/20 border border-[#26d464]/40 text-[#26d464] text-xs font-mono font-bold hover:bg-[#26d464]/30 transition"
                      >
                        <IconDownload className="w-4 h-4" />
                        <span>Download CAD</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUnlock(bp)}
                        disabled={isUnlocking}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2e2e2e] hover:border-[#26d464]/50 text-[#ededed] text-xs font-mono font-medium hover:text-[#26d464] transition active:scale-98"
                      >
                        <IconLock className="w-3.5 h-3.5 text-[#26d464]" />
                        <span>Unlock ({bp.costExpen} EXPEN)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. BLUEPRINT GD&T INSPECTION MODAL / DRAWER
         ────────────────────────────────────────────────────────── */}
      {selectedBlueprint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-[#121212] border border-[#2e2e2e] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#262626] pb-4">
              <div>
                <span className="text-xs font-mono text-[#26d464] font-bold">
                  [{selectedBlueprint.id}] // GD&T INSPECTION VIEW
                </span>
                <h3 className="text-xl font-bold text-[#ededed] font-display mt-1">
                  {selectedBlueprint.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBlueprint(null)}
                className="text-[#71717a] hover:text-[#ededed] text-sm font-mono px-2 py-1 rounded bg-[#181818] border border-[#262626]"
              >
                ✕ Close
              </button>
            </div>

            {/* Wireframe CAD Blueprint Drawing simulation */}
            <div className="w-full h-48 rounded-xl bg-[#070b12] border border-[#1e2a3a] p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
              <div className="flex justify-between text-[#38bdf8]/60">
                <span>DATUM A: [FLATNESS 0.005 | A]</span>
                <span>ISO 2768-mK</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="border border-[#38bdf8]/40 border-dashed w-48 h-24 rounded flex items-center justify-center relative">
                  <span className="text-[#38bdf8] font-bold tracking-wider">
                    {selectedBlueprint.category.toUpperCase()}
                  </span>
                  <div className="absolute -top-3 text-[#38bdf8]/80">◄── 120.00 ±0.01 ──►</div>
                  <div className="absolute -left-4 rotate-90 text-[#38bdf8]/80">65.0 ±0.02</div>
                </div>
              </div>
              <div className="flex justify-between text-[#38bdf8]/60">
                <span>AUTHOR: {selectedBlueprint.author}</span>
                <span>FILE: {selectedBlueprint.fileSize}</span>
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#a1a1aa]">
                Critical Machining Specifications:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {selectedBlueprint.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#181818] border border-[#262626] flex justify-between"
                  >
                    <span className="text-[#71717a]">{s.key}:</span>
                    <span className="text-[#ededed] font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedBlueprint(null)}
              >
                Done Inspecting
              </Button>
              {unlockedIds.includes(selectedBlueprint.id) ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Downloading CAD package for ${selectedBlueprint.id}`)}
                >
                  <IconDownload className="w-4 h-4 mr-1.5" />
                  <span>Download Blueprint Package</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUnlock(selectedBlueprint)}
                  disabled={isUnlocking}
                >
                  <IconLock className="w-4 h-4 mr-1.5" />
                  <span>Unlock for {selectedBlueprint.costExpen} EXPEN</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
