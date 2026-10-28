import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductById } from "@/data/products";
import BuyButton from "@/components/marketplace/BuyButton";
import {
  IconCube3D,
  IconThermal,
  IconCaliper,
  IconBlueprint,
  IconSpindle,
  IconToken,
  IconCheck,
} from "@/components/ui/Icons";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg==";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Product Not Found — Expendry" };
  }
  return {
    title: `${product.name} — Expendry Tooling Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const expenTokens = (product.price * 2).toFixed(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-body pt-16 selection:bg-[#26d464]/20 selection:text-[#ededed]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb & Navigation Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#a1a1aa] pb-4 border-b border-[#262626]"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/marketplace"
              className="hover:text-[#ededed] transition text-[#a1a1aa]"
            >
              Marketplace
            </Link>
            <span className="text-[#383838]">/</span>
            <span className="text-[#a1a1aa]">{product.category}</span>
            <span className="text-[#383838]">/</span>
            <span className="text-[#ededed] font-medium truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="telemetry-chip">
              REF: EXP-TL-{product.id.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#26d464]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
              Verified Spec
            </span>
          </div>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase Panel */}
          <div className="lg:col-span-6 rounded-2xl border border-[#262626] bg-[#121212] p-6 sm:p-8 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden specular-card">
            {/* Top metadata tags inside visual viewport */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="telemetry-chip">
                {product.category}
              </span>
              <span className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Precision Grade A1
              </span>
            </div>

            {/* Inner Image Well */}
            <div className="w-full rounded-xl border border-[#262626] bg-[#0e0e0e] p-8 flex items-center justify-center relative min-h-[300px] overflow-hidden">
              {/* Specular Radial Background Highlight */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none"
              />

              <div className="relative w-56 h-56 transition-transform duration-500 hover:scale-105 motion-reduce:hover:scale-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-contain"
                />
              </div>
            </div>

            {/* 3D Model Inspection Action */}
            <div className="w-full mt-6">
              {product.has3DModel ? (
                <Link
                  href={`/showcase?model=${product.modelId}`}
                  className="inline-flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl bg-[#26d464]/10 border border-[#26d464]/30 text-[#26d464] hover:bg-[#26d464]/20 hover:border-[#26d464]/60 transition text-xs font-semibold font-montserrat shadow-sm shadow-[#26d464]/10 group"
                >
                  <IconCube3D className="w-4 h-4 text-[#26d464] group-hover:scale-110 transition-transform" />
                  <span>Inspect in Interactive 3D Viewer</span>
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#262626] text-[#a1a1aa] text-xs font-mono">
                  <span>Standard 2D Tooling Model</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Meta & Purchase Panel */}
          <div className="lg:col-span-6 rounded-2xl border border-[#262626] bg-[#121212] p-6 sm:p-8 flex flex-col justify-between min-h-[460px] specular-card space-y-6">
            <div>
              {/* Category & Stock Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="telemetry-chip">
                  {product.category}
                </span>
                <span className="text-xs text-[#26d464] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none" />
                  In Stock &amp; Ready for Dispatch
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ededed] font-montserrat tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Verified machinist credentials */}
              {product.rating && (
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                  <span className="text-[#ededed] font-semibold">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-[#383838]">•</span>
                  <span>{product.reviewsCount} Machinist Reviews</span>
                  <span className="text-[#383838]">•</span>
                  <span className="text-[#26d464] flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5" />
                    Verified MST Origin
                  </span>
                </div>
              )}

              {/* Pricing Well */}
              <div className="mt-6 rounded-xl border border-[#262626] bg-[#161616] p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#a1a1aa] tracking-widest block mb-1">
                    Unit Price (USD)
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#ededed] font-montserrat tracking-tight">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-mono text-[#a1a1aa] tracking-widest block mb-1">
                    Token Settlement
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-mono text-[#26d464] font-bold">
                    <IconToken className="w-4 h-4 text-[#26d464]" />
                    <span>{expenTokens} EXPEN Tokens</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm text-[#a1a1aa] leading-relaxed font-body">
                {product.description}
              </p>
            </div>

            {/* Acquisition Controls */}
            <div className="pt-6 border-t border-[#262626] flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <BuyButton product={product} />

              <Link
                href="/marketplace"
                className="px-5 py-3 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] border border-[#262626] hover:border-[#383838] text-[#ededed] text-sm font-semibold transition text-center font-montserrat"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Metallurgical Matrix Card */}
        <section aria-labelledby="metallurgical-matrix-title">
          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-6 sm:p-8 specular-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#262626]">
              <div>
                <h2
                  id="metallurgical-matrix-title"
                  className="text-xl font-bold text-[#ededed] font-montserrat tracking-tight"
                >
                  Metallurgical Matrix
                </h2>
                <p className="text-xs text-[#a1a1aa] font-body mt-1">
                  Microstructure composition, hardness gradients, and thermal barrier verification.
                </p>
              </div>
              <span className="telemetry-chip self-start sm:self-auto">
                ISO 2768 / DIN 69871
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Metric 1: Substrate Chemistry */}
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa]">
                      Substrate Chemistry
                    </span>
                    <IconSpindle className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#ededed]">
                    WC-Co Sub-micron Grain (0.6 μm)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#262626]/80 text-[11px] font-mono text-[#a1a1aa]">
                  Tungsten Carbide Matrix
                </div>
              </div>

              {/* Metric 2: Hardness */}
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa]">
                      Hardness
                    </span>
                    <IconCaliper className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#ededed]">
                    1650 - 1800 HV30
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#262626]/80 text-[11px] font-mono text-[#a1a1aa]">
                  Vickers Micro-Indentation
                </div>
              </div>

              {/* Metric 3: Thermal Barrier */}
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa]">
                      Thermal Barrier
                    </span>
                    <IconThermal className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#ededed]">
                    AlTiN Multilayer (Up to 900°C)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#262626]/80 text-[11px] font-mono text-[#a1a1aa]">
                  PVD Oxidation Resistance
                </div>
              </div>

              {/* Metric 4: Quality Standard */}
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa]">
                      Quality Standard
                    </span>
                    <IconBlueprint className="w-4 h-4 text-[#26d464]" />
                  </div>
                  <div className="text-sm font-mono font-semibold text-[#ededed]">
                    ISO 2768-mK / DIN 69871
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#262626]/80 text-[11px] font-mono text-[#a1a1aa]">
                  Tolerancing &amp; Taper Spec
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications Table */}
        <section aria-labelledby="technical-specifications-title">
          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-6 sm:p-8 specular-card">
            <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
              <div>
                <h2
                  id="technical-specifications-title"
                  className="text-xl font-bold text-[#ededed] font-montserrat tracking-tight flex items-center gap-2"
                >
                  <span>Technical Specifications</span>
                </h2>
                <p className="text-xs text-[#a1a1aa] font-body mt-1">
                  Dimensional calibrations, geometry parameters, and manufacturer tolerances.
                </p>
              </div>
              <span className="telemetry-chip">
                Calibrated Tool Data
              </span>
            </div>

            <div className="rounded-xl border border-[#262626] bg-[#0e0e0e] overflow-hidden mt-6">
              <table className="min-w-full divide-y divide-[#262626] text-left text-sm">
                <tbody className="divide-y divide-[#262626]">
                  <tr className="bg-[#161616]">
                    <td className="px-6 py-4 font-medium text-[#a1a1aa] w-1/3 text-xs sm:text-sm font-body">
                      Product Identifier
                    </td>
                    <td className="px-6 py-4 text-[#ededed] font-mono text-xs sm:text-sm">
                      {product.id}
                    </td>
                  </tr>
                  <tr className="bg-[#0e0e0e]">
                    <td className="px-6 py-4 font-medium text-[#a1a1aa] text-xs sm:text-sm font-body">
                      Category Classification
                    </td>
                    <td className="px-6 py-4 text-[#ededed] font-mono text-xs sm:text-sm">
                      {product.category}
                    </td>
                  </tr>
                  <tr className="bg-[#161616]">
                    <td className="px-6 py-4 font-medium text-[#a1a1aa] text-xs sm:text-sm font-body">
                      Settlement Currency
                    </td>
                    <td className="px-6 py-4 text-[#26d464] font-mono text-xs sm:text-sm">
                      EXPEN (MST Testnet ERC-20) / USD Fiat
                    </td>
                  </tr>
                  {product.specs &&
                    Object.entries(product.specs).map(([specKey, specVal], idx) => (
                      <tr
                        key={specKey}
                        className={idx % 2 === 0 ? "bg-[#0e0e0e]" : "bg-[#161616]"}
                      >
                        <td className="px-6 py-4 font-medium text-[#a1a1aa] capitalize text-xs sm:text-sm font-body">
                          {specKey.replace(/([A-Z])/g, " $1")}
                        </td>
                        <td className="px-6 py-4 text-[#ededed] font-mono text-xs sm:text-sm">
                          {specVal}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
