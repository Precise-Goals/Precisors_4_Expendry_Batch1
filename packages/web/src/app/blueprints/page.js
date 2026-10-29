"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
  IconToken,
  IconShield,
} from "@/components/ui/Icons";
import { CHAIN_ID, OPERATOR_ADDRESS } from "shared/constants";

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
    datumA: "Flatness 0.004 mm",
    datumB: "Perpendicularity 0.006 mm | A",
    datumC: "Parallelism 0.005 mm | A-B",
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
    datumA: "Total Runout 0.003 mm",
    datumB: "Cylindricity 0.005 mm",
    datumC: "True Position 0.008 mm | A-B",
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
    datumA: "Concentricity 0.015 mm",
    datumB: "Perpendicularity 0.020 mm | A",
    datumC: "Surface Profile 0.030 mm",
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
    datumA: "Roundness 0.004 mm",
    datumB: "Concentricity 0.006 mm | A",
    datumC: "Parallelism 0.008 mm",
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
    datumA: "Flatness 0.003 mm",
    datumB: "Perpendicularity 0.005 mm | A",
    datumC: "True Position 0.004 mm | A-B",
  },
];

export default function BlueprintsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState(["BP-01"]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const handleDownloadPayload = (bp) => {
    const dummyCadData = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Expendry Precision CAD Model - ${bp.title}'),'2;1');
FILE_NAME('${bp.id}_spec.step','2026-10-29T12:00:00',('${bp.author}'),('Expendry Decentralized Tooling'),'OpenCASCADE 7.6','MST-Testnet-${CHAIN_ID}','');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));
ENDSEC;
DATA;
#1=CARTESIAN_POINT('',(0.,0.,0.));
#2=DIRECTION('',(0.,0.,1.));
#3=AXIS2_PLACEMENT_3D('',#1,#2,#2);
#4=TOLERANCE_ZONE('${bp.tolerance}',#3);
#5=EXPEN_OPERATOR_ANCHOR('${OPERATOR_ADDRESS}');
ENDSEC;
END-ISO-10303-21;`;

    const blob = new Blob([dummyCadData], { type: "application/step" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bp.id}_${bp.title.replace(/[^a-zA-Z0-9]/g, "_")}.step`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#26d464]/30 selection:text-[#ededed] bg-blueprint-grid">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Blueprints Repository
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Blueprints Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#262626]"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500">+ [CAD/CAM // GD&T]</div>
          <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500">+ [ISO-2768-mK]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]">
            <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
            <span className="text-xs font-mono font-medium text-[#ededed]">Engineering Blueprints & GD&T CAD Crib</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-mono text-[#26d464]">MST-{CHAIN_ID}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ededed] font-montserrat leading-[1.15]">
            Machinist CAD/CAM Blueprints & Tooling Specs
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-3xl font-poppins">
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
                      ? "bg-[#1c1c1c] border-[#26d464] text-[#ededed] font-bold shadow-sm shadow-[#26d464]/20"
                      : "bg-[#121212] border-[#262626] text-[#a1a1aa] hover:text-[#ededed] hover:border-[#383838]"
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
                className="w-full px-3 py-1.5 rounded-lg bg-[#121212] border border-[#262626] text-xs font-mono text-[#ededed] placeholder-zinc-500 focus:outline-none focus:border-[#26d464]"
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
                  className="p-6 rounded-2xl bg-[#121212] border border-[#262626] specular-card space-y-4 hover:border-[#383838] transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#26d464] font-bold">[{bp.id}]</span>
                      <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2e2e2e] text-[#a1a1aa]">
                        {bp.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#ededed] font-montserrat">
                      {bp.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed font-poppins">
                      {bp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0e0e0e] border border-[#222222] text-xs font-mono text-[#a1a1aa]">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">TOLERANCE:</span>
                        <span className="text-[#ededed]">{bp.tolerance}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">MATERIAL:</span>
                        <span className="text-[#ededed] truncate block">{bp.material}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">SURFACE:</span>
                        <span className="text-[#26d464]">{bp.surfaceFinish}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px]">CAD FORMAT:</span>
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
                        onClick={() => handleDownloadPayload(bp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26d464]/20 border border-[#26d464]/40 text-[#26d464] text-xs font-mono font-bold hover:bg-[#26d464]/30 transition"
                      >
                        <IconDownload className="w-4 h-4" />
                        <span>Download STEP</span>
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-[#121212] border border-[#262626] specular-card shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#262626] pb-4">
              <div>
                <span className="text-xs font-mono text-[#26d464] font-bold">
                  [{selectedBlueprint.id}] // GD&T INSPECTION SCHEMATIC
                </span>
                <h3 className="text-xl font-bold text-[#ededed] font-montserrat mt-1">
                  {selectedBlueprint.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBlueprint(null)}
                className="text-[#a1a1aa] hover:text-[#ededed] text-sm font-mono px-2 py-1 rounded bg-[#181818] border border-[#262626]"
              >
                ✕ Close
              </button>
            </div>

            {/* Wireframe CAD Blueprint Drawing simulation */}
            <div className="w-full rounded-xl bg-[#080d14] border border-[#1e2a3a] p-4 flex flex-col justify-between relative overflow-hidden font-mono text-[10px]">
              <div className="flex justify-between text-[#38bdf8]/70 border-b border-[#1e2a3a]/60 pb-2">
                <span>DATUM A: [{selectedBlueprint.datumA}]</span>
                <span>TOL: {selectedBlueprint.tolerance}</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.25 : 1))}
                  className="text-xs text-[#26d464] hover:underline"
                >
                  Zoom {zoomLevel}x
                </button>
              </div>

              <div className="py-6 flex items-center justify-center transition-transform duration-300" style={{ transform: `scale(${zoomLevel})` }}>
                <div className="border border-[#38bdf8]/50 border-dashed w-56 h-28 rounded flex flex-col items-center justify-center relative bg-[#38bdf8]/5">
                  <span className="text-[#38bdf8] font-bold tracking-wider text-xs">
                    {selectedBlueprint.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">{selectedBlueprint.material}</span>
                  <div className="absolute -top-3 text-[#38bdf8]/90 bg-[#080d14] px-1.5 border border-[#38bdf8]/40 rounded">
                    ◄── 120.00 ±0.005 ──►
                  </div>
                  <div className="absolute -left-5 -rotate-90 text-[#38bdf8]/90 bg-[#080d14] px-1 border border-[#38bdf8]/40 rounded">
                    65.0 ±0.005
                  </div>
                  <div className="absolute -bottom-3 text-[#26d464] bg-[#080d14] px-1.5 border border-[#26d464]/40 rounded">
                    {selectedBlueprint.surfaceFinish}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[#38bdf8]/70 border-t border-[#1e2a3a]/60 pt-2">
                <span>DATUM B: [{selectedBlueprint.datumB}]</span>
                <span>DATUM C: [{selectedBlueprint.datumC}]</span>
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
                    <span className="text-zinc-500">{s.key}:</span>
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
                  onClick={() => handleDownloadPayload(selectedBlueprint)}
                >
                  <IconDownload className="w-4 h-4 mr-1.5" />
                  <span>Download STEP CAD Package</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUnlock(selectedBlueprint)}
                  disabled={isUnlocking}
                >
                  <IconLock className="w-4 h-4 mr-1.5" />
                  <span>{isUnlocking ? "Verifying..." : `Unlock for ${selectedBlueprint.costExpen} EXPEN`}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
