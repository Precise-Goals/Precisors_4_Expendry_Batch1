"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MODELS } from "@/data/models";

const ModelViewer = dynamic(
  () => import("@/components/showcase/ModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col items-center justify-center gap-3 animate-pulse text-neutral-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#26d464] border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Loading 3D Canvas...</span>
      </div>
    ),
  }
);

export default function ShowcasePage() {
  const [activeModelId, setActiveModelId] = useState("lathe-body");
  const activeModel =
    MODELS.find((m) => m.id === activeModelId) || MODELS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464]">
                Interactive WebGL 3D
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-montserrat">
              3D Tooling Inspection Showcase
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Inspect critical tooling geometries, insert seats, flutes, and
              relief angles with real-time orbit controls.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-200 hover:text-white transition text-sm font-semibold self-start md:self-auto"
          >
            <span>Browse Full Marketplace</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Model Tabs Navigation */}
        <div className="py-6 flex flex-wrap gap-3">
          {MODELS.map((model) => {
            const isSelected = activeModelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActiveModelId(model.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#26d464] text-neutral-950 shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-neutral-950" : "bg-neutral-600"
                  }`}
                />
                <span>{model.shortName || model.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Showcase Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive 3D Canvas Viewport */}
          <div className="lg:col-span-7 h-[460px] sm:h-[540px] rounded-2xl border border-neutral-800 bg-neutral-950/60 overflow-hidden shadow-2xl relative">
            <ModelViewer modelId={activeModelId} autoRotate={true} />
          </div>

          {/* Model Specification & Metadata Card */}
          <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-6 sm:p-8 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                  {activeModel.geometryType}
                </span>
                <span className="text-xs font-mono text-[#26d464]">
                  {activeModel.segments} Radial Segments
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight font-montserrat">
                {activeModel.name}
              </h2>

              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                {activeModel.description}
              </p>

              {/* Technical Specifications */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Tooling Metadata
                </h3>
                <dl className="space-y-2.5 text-xs">
                  {activeModel.specs &&
                    Object.entries(activeModel.specs).map(([label, val]) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-1 border-b border-neutral-900/60"
                      >
                        <dt className="text-neutral-500 capitalize">
                          {label.replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="font-mono text-neutral-200">{val}</dd>
                      </div>
                    ))}
                  <div className="flex justify-between items-center py-1">
                    <dt className="text-neutral-500">PBR Metallic / Roughness</dt>
                    <dd className="font-mono text-[#26d464]">
                      {activeModel.materials.metalness.toFixed(2)} /{" "}
                      {activeModel.materials.roughness.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* View in Marketplace CTA */}
            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
              <Link
                href={`/marketplace/${activeModel.productId}`}
                className="w-full py-3 rounded-xl bg-[#26d464] text-neutral-950 font-bold text-sm hover:bg-[#20b855] transition text-center shadow-lg shadow-[#26d464]/10 flex items-center justify-center gap-2"
              >
                <span>View in Marketplace</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dual Panel Comparison Grid */}
        <div className="mt-16 pt-12 border-t border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-6">
            Compare Top Machining Geometries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODELS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-800 bg-[#0d0d0d] p-6 hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#26d464]">
                      {item.geometryType}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {item.id}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModelId(item.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="text-xs font-semibold text-[#26d464] hover:underline"
                  >
                    Inspect Above
                  </button>
                  <Link
                    href={`/marketplace/${item.productId}`}
                    className="text-xs text-neutral-300 hover:text-white underline"
                  >
                    Marketplace Record
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
