"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BIORAD_MODELS } from "@/data/models";
import { PRODUCTS } from "@/data/products";

const ModelViewer = dynamic(
  () => import("@/components/showcase/ModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[580px] rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center gap-3 animate-pulse text-zinc-500">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider font-bold text-emerald-700">Initializing CAD Viewport...</span>
      </div>
    ),
  }
);

export default function ShowcasePage() {
  const [activeModelId, setActiveModelId] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const modelParam = urlParams.get("model");
      if (modelParam && BIORAD_MODELS.some((m) => m.id === modelParam)) {
        return modelParam;
      }
    }
    return BIORAD_MODELS[0]?.id || "excel-mpk";
  });

  const activeModel =
    BIORAD_MODELS.find((m) => m.id === activeModelId) || BIORAD_MODELS[0];

  const activeProduct =
    PRODUCTS.find((p) => p.id === activeModel.productId) || PRODUCTS[0];

  // Turret preset keyboard shortcuts: [1] through [9] strictly for Biorad products
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= BIORAD_MODELS.length) {
        setActiveModelId(BIORAD_MODELS[num - 1].id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-16 bg-blueprint-grid selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                Biorad Medisys Pune · 9 Certified Clinical Products
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Interactive 3D Tooling &amp; Implant Inspection
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-3xl font-poppins">
              Centrally calibrated Three.js CAD inspection of the 9 high-precision Biorad Medisys Pune products: knee joints, hip stems, dual-mobility cups, ureteral stents, and endoscopy instruments.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white transition text-xs font-bold font-mono self-start md:self-auto shadow-sm active:scale-95"
          >
            <span>Browse 3D Catalog</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 9 Biorad Implants Turret Selector */}
        <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 rounded-3xl bg-zinc-50/90 border border-zinc-200/90 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold px-2">
            Biorad Catalog ({BIORAD_MODELS.length} Implants):
          </span>
          <div className="flex flex-wrap gap-2">
            {BIORAD_MODELS.map((model, idx) => {
              const isSelected = activeModelId === model.id;
              const turretCode = `M-0${idx + 1}`;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setActiveModelId(model.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-800 text-white shadow-md border border-emerald-900"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isSelected ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"
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
        </div>

        {/* ──────────────────────────────────────────────────────────
            CENTERED BIG-SCREEN 3D VIEWPORT
           ────────────────────────────────────────────────────────── */}
        <div className="w-full h-[580px] sm:h-[680px] lg:h-[760px] rounded-4xl border border-zinc-200/90 bg-white/95 overflow-hidden shadow-2xl relative ring-1 ring-zinc-900/5">
          <ModelViewer modelId={activeModelId} autoRotate={true} />
        </div>

        {/* Technical Specification Matrix & Calibration Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left Column: Calibration & Geometry Matrix */}
          <div className="lg:col-span-8 rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
                  Biorad Medisys CAD Calibration Specification
                </span>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold">
                ISO 13485:2016 Certified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                {activeProduct?.category || "Orthopedic Knees"}
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold">
                {activeModel.geometryType}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                Mesh Density: {activeModel.segments || 64} Segments
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-montserrat">
              {activeProduct?.name || activeModel.name}
            </h2>

            <p className="text-sm text-zinc-600 mt-3 leading-relaxed font-poppins">
              {activeProduct?.description || activeModel.description}
            </p>

            <div className="mt-8 pt-6 border-t border-zinc-200">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-4">
                Dimensional Tolerances &amp; Material Metrics
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {activeProduct?.specs &&
                  Object.entries(activeProduct.specs).map(([label, val]) => (
                    <div
                      key={label}
                      className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center"
                    >
                      <dt className="text-zinc-600 capitalize">
                        {label.replace(/([A-Z])/g, " $1")}
                      </dt>
                      <dd className="text-zinc-900 font-bold">{val}</dd>
                    </div>
                  ))}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                  <dt className="text-zinc-600">Manufacturing Standard</dt>
                  <dd className="text-emerald-700 font-bold">ISO 5832 / ASTM F75 / ISO 13485</dd>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center">
                  <dt className="text-zinc-600">Surface Finish (Ra)</dt>
                  <dd className="text-emerald-700 font-bold">Ra ≤ 0.02 µm (Electropolished Mirror)</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Marketplace Integration & Action */}
          <div className="lg:col-span-4 rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-2">
                Biorad Production Unit
              </span>
              <h3 className="text-xl font-bold text-zinc-900 font-montserrat">
                Biorad Medisys Pune
              </h3>
              <p className="text-xs text-zinc-600 mt-2 font-poppins leading-relaxed">
                Directly referenced from Biorad Medisys Pune manufacturing plant. Backed by verified MST blockchain telemetry records.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-white border border-zinc-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Implant Model ID:</span>
                  <span className="font-bold text-zinc-900">{activeModel.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Biorad Product ID:</span>
                  <span className="font-bold text-emerald-800">{activeModel.productId}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Asset File:</span>
                  <span className="text-emerald-700 font-bold">{activeModel.glbPath?.replace('/3d-models-products/', '') || 'GLB'}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Market Price:</span>
                  <span className="text-zinc-900 font-bold">{activeProduct?.price ? `$${activeProduct.price} USD` : "Inquire"}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Machinist Reward:</span>
                  <span className="text-orange-600 font-bold">10 EXPEN / Post</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <Link
                href={`/marketplace/${activeModel.productId}`}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>View in Marketplace Catalog</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/heritage"
                className="w-full py-3 px-4 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-semibold text-xs transition text-center flex items-center justify-center gap-2"
              >
                <span>Read Biorad Medisys Evolution Story</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dual Panel Comparison Grid — Strictly the 9 Biorad Products */}
        <div className="pt-10 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-montserrat">
              Compare 3D Implants &amp; Tooling
            </h2>
            <span className="text-xs font-mono text-zinc-700 font-bold">
              9 Active Biorad Medisys Surgical Products
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BIORAD_MODELS.map((item, idx) => {
              const prod = PRODUCTS.find((p) => p.id === item.productId);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-emerald-500/50 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-emerald-700 font-bold">
                        M-0{idx + 1} {'//'} {prod?.category || item.geometryType}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {item.productId}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 font-montserrat">
                      {prod?.name || item.name}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed line-clamp-2 font-poppins">
                      {prod?.description || item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModelId(item.id);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 font-mono cursor-pointer"
                    >
                      Inspect in CAD HUD ↑
                    </button>
                    <Link
                      href={`/marketplace/${item.productId}`}
                      className="text-xs text-zinc-600 hover:text-zinc-900 font-medium"
                    >
                      Details ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
