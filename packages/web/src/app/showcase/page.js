"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MODELS } from "@/data/models";

const ModelViewer = dynamic(
  () => import("@/components/showcase/ModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] rounded-2xl bg-[#0e0e0e] border border-[#262626] flex flex-col items-center justify-center gap-3 animate-pulse text-[#a1a1aa]">
        <div className="w-8 h-8 rounded-full border-2 border-[#26d464] border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Initializing CAD Viewport...</span>
      </div>
    ),
  }
);

export default function ShowcasePage() {
  const [activeModelId, setActiveModelId] = useState("lathe-body");
  const activeModel =
    MODELS.find((m) => m.id === activeModelId) || MODELS[0];

  // Read model from URL query parameter on mount if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const modelParam = urlParams.get("model");
      if (modelParam && MODELS.some((m) => m.id === modelParam)) {
        setActiveModelId(modelParam);
      }
    }
  }, []);

  // Turret preset keyboard shortcuts: [1], [2], [3], [4]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "1") {
        setActiveModelId("lathe-body");
      } else if (e.key === "2") {
        setActiveModelId("drill-bit");
      } else if (e.key === "3") {
        setActiveModelId("end-mill");
      } else if (e.key === "4") {
        setActiveModelId("face-mill");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] pt-16 bg-blueprint-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464]">
                CAD/CAM Workstation Viewport
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-montserrat">
              3D Tooling Inspection Showcase
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1 max-w-2xl">
              Inspect critical tooling geometries, insert seats, flutes, and
              relief angles with real-time CAD orbit controls and telemetry.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#26d464]/60 text-[#ededed] hover:text-white transition text-sm font-semibold self-start md:self-auto shadow-sm"
          >
            <span>Browse Full Tooling Catalog</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* CNC Tool Turret Preset Selector */}
        <div className="py-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717a] mr-2">
            Tool Turret:
          </span>
          {MODELS.map((model, idx) => {
            const isSelected = activeModelId === model.id;
            const turretCode = `T-0${idx + 1}`;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActiveModelId(model.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-mono transition-all duration-150 flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-[#26d464] text-black shadow-lg shadow-[#26d464]/20 border border-[#26d464]"
                    : "bg-[#141414] border border-[#262626] text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#1c1c1c]"
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? "bg-black/20 text-black" : "bg-[#222222] text-[#ededed]"
                  }`}
                >
                  [{idx + 1}]
                </span>
                <span>
                  {turretCode}: {model.shortName || model.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3D Showcase Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive 3D Canvas Viewport */}
          <div className="lg:col-span-7 h-[480px] sm:h-[560px] rounded-2xl border border-[#262626] bg-[#0c0c0c] overflow-hidden shadow-2xl relative specular-card">
            <ModelViewer modelId={activeModelId} autoRotate={true} />
          </div>

          {/* Model Specification: Formal CNC Tool Inspection Sheet */}
          <div className="lg:col-span-5 rounded-2xl border border-[#262626] bg-[#121212] p-6 sm:p-8 flex flex-col justify-between min-h-[480px] sm:min-h-[560px] specular-card shadow-2xl">
            <div>
              {/* Inspection Sheet Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#26d464]" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#ededed] font-bold">
                    CNC Tool Inspection Sheet
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] border border-[#262626] text-[#a1a1aa]">
                  ISO 2768-mK
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#262626] text-[#ededed]">
                  {activeModel.geometryType}
                </span>
                <span className="text-xs font-mono text-[#26d464]">
                  {activeModel.segments} Radial Segments
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#ededed] tracking-tight font-montserrat">
                {activeModel.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-3 leading-relaxed">
                {activeModel.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="mt-6 pt-5 border-t border-[#222222]">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] mb-3">
                  Calibration & Geometry Parameters
                </h3>
                <dl className="space-y-2 text-xs">
                  {activeModel.specs &&
                    Object.entries(activeModel.specs).map(([label, val]) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-1 border-b border-[#1a1a1a]"
                      >
                        <dt className="text-[#a1a1aa] capitalize">
                          {label.replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="font-mono text-[#ededed] font-medium">{val}</dd>
                      </div>
                    ))}
                  <div className="flex justify-between items-center py-1 border-b border-[#1a1a1a]">
                    <dt className="text-[#a1a1aa]">Tolerance Class</dt>
                    <dd className="font-mono text-[#26d464] font-bold">±0.005 mm (Precision Ground)</dd>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#1a1a1a]">
                    <dt className="text-[#a1a1aa]">Spindle Interface</dt>
                    <dd className="font-mono text-[#ededed]">BT40 / CAT40 / HSK63</dd>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <dt className="text-[#a1a1aa]">PBR Metallic / Roughness</dt>
                    <dd className="font-mono text-[#26d464]">
                      {activeModel.materials.metalness.toFixed(2)} /{" "}
                      {activeModel.materials.roughness.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* View in Marketplace CTA */}
            <div className="mt-8 pt-5 border-t border-[#222222] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#a1a1aa]">Estimated Tooling Cost:</span>
                <span className="text-[#26d464] font-bold">$149.00 // 298 EXPEN</span>
              </div>
              <Link
                href={`/marketplace/${activeModel.productId}`}
                className="w-full py-3 rounded-xl bg-[#26d464] text-black font-bold text-sm hover:bg-[#20b855] transition text-center shadow-lg shadow-[#26d464]/10 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Acquire in Tooling Marketplace</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dual Panel Comparison Grid */}
        <div className="mt-16 pt-12 border-t border-[#262626]">
          <h2 className="text-xl font-bold text-[#ededed] mb-6 font-display">
            Compare Top Machining Geometries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODELS.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#262626] bg-[#121212] p-6 hover:border-[#383838] transition flex flex-col justify-between specular-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#26d464] font-semibold">
                      T-0{idx + 1} // {item.geometryType}
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">
                      REF: {item.id}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#ededed]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1c1c1c] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModelId(item.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="text-xs font-semibold text-[#26d464] hover:underline font-mono"
                  >
                    Inspect in CAD HUD ↑
                  </button>
                  <Link
                    href={`/marketplace/${item.productId}`}
                    className="text-xs text-[#a1a1aa] hover:text-[#ededed] underline"
                  >
                    Marketplace Record ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
