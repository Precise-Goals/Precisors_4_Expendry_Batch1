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
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNSIvPjwvc3ZnPg==";

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
    <div className="min-h-screen bg-transparent text-zinc-900 font-body pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb & Navigation Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 pb-4 border-b border-zinc-200"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/marketplace"
              className="hover:text-emerald-700 transition text-zinc-600 font-medium"
            >
              Marketplace
            </Link>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600">{product.category}</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="telemetry-chip">
              REF: EXP-TL-{product.id.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
              Verified Spec
            </span>
          </div>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase Panel */}
          <div className="lg:col-span-6 rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden shadow-sm">
            {/* Top metadata tags inside visual viewport */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="telemetry-chip">
                {product.category}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                Precision Grade A1
              </span>
            </div>

            {/* Inner Image Well */}
            <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 flex items-center justify-center relative min-h-[300px] overflow-hidden">
              <div className="relative w-64 h-64 transition-transform duration-500 hover:scale-105 motion-reduce:hover:scale-100">
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
                  className="inline-flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white transition text-xs font-bold font-montserrat shadow-md group active:scale-[0.98] cursor-pointer"
                >
                  <IconCube3D className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Inspect in Interactive 3D Viewer</span>
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 text-xs font-mono">
                  <span>Standard 2D Tooling Model</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Meta & Purchase Panel */}
          <div className="lg:col-span-6 rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between min-h-[460px] shadow-sm space-y-6">
            <div>
              {/* Category & Stock Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="telemetry-chip">
                  {product.category}
                </span>
                <span className="text-xs text-emerald-700 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
                  In Stock &amp; Ready for Dispatch
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-montserrat tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Verified machinist credentials */}
              {product.rating && (
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="text-zinc-900 font-bold">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span>{product.reviewsCount} Machinist Reviews</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified MST Origin
                  </span>
                </div>
              )}

              {/* Pricing Well */}
              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest block mb-1 font-bold">
                    Unit Price (USD)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-mono tracking-tight tabular-nums">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest block mb-1 font-bold">
                    Token Settlement (MST Testnet)
                  </span>
                  <div className="inline-flex items-center gap-2 text-base sm:text-lg font-mono text-emerald-700 font-bold">
                    <IconToken className="w-4 h-4 text-emerald-600" />
                    <span>{expenTokens} EXPEN</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm text-zinc-600 leading-relaxed font-body">
                {product.description}
              </p>
            </div>

            {/* Acquisition Controls */}
            <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <BuyButton product={product} />

              <Link
                href="/marketplace"
                className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-bold transition text-center font-montserrat active:scale-[0.98]"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Metallurgical Matrix Card */}
        <section aria-labelledby="metallurgical-matrix-title">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-200">
              <div>
                <h2
                  id="metallurgical-matrix-title"
                  className="text-xl font-bold text-zinc-900 font-montserrat tracking-tight"
                >
                  Metallurgical Matrix
                </h2>
                <p className="text-xs text-zinc-600 font-body mt-1">
                  Microstructure composition, hardness gradients, and thermal barrier verification.
                </p>
              </div>
              <span className="telemetry-chip self-start sm:self-auto">
                ISO 13485 / ASTM F75
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Metric 1: Substrate Chemistry */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      Substrate Chemistry
                    </span>
                    <IconSpindle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-900">
                    CoCrMo Cast Alloy (ASTM F75)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] font-mono text-zinc-500">
                  Biocompatible Joint Substrate
                </div>
              </div>

              {/* Metric 2: Hardness */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      Hardness
                    </span>
                    <IconCaliper className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-900">
                    35 - 45 HRC (Core Heat Treated)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] font-mono text-zinc-500">
                  Rockwell Scale Verification
                </div>
              </div>

              {/* Metric 3: Thermal Barrier */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      Surface Finish
                    </span>
                    <IconThermal className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-900">
                    Ra ≤ 0.02 μm (Super-finish)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] font-mono text-zinc-500">
                  Precision Joint Articulation
                </div>
              </div>

              {/* Metric 4: Quality Standard */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      Quality Standard
                    </span>
                    <IconBlueprint className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-mono font-bold text-zinc-900">
                    ISO 13485:2016 / CE Mark
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 text-[11px] font-mono text-zinc-500">
                  Medical Device Regulatory Spec
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications Table */}
        <section aria-labelledby="technical-specifications-title">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
              <div>
                <h2
                  id="technical-specifications-title"
                  className="text-xl font-bold text-zinc-900 font-montserrat tracking-tight flex items-center gap-2"
                >
                  <span>Technical Specifications</span>
                </h2>
                <p className="text-xs text-zinc-600 font-body mt-1">
                  Dimensional calibrations, geometry parameters, and manufacturer tolerances.
                </p>
              </div>
              <span className="telemetry-chip">
                Calibrated Tool Data
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200 overflow-hidden mt-6">
              <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                <tbody className="divide-y divide-zinc-200">
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-zinc-600 w-1/3 text-xs sm:text-sm font-body">
                      Product Identifier
                    </td>
                    <td className="px-6 py-4 text-zinc-900 font-mono text-xs sm:text-sm font-bold">
                      {product.id}
                    </td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-zinc-600 text-xs sm:text-sm font-body">
                      Category Classification
                    </td>
                    <td className="px-6 py-4 text-zinc-900 font-mono text-xs sm:text-sm font-bold">
                      {product.category}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-zinc-600 text-xs sm:text-sm font-body">
                      Settlement Currency
                    </td>
                    <td className="px-6 py-4 text-emerald-700 font-mono text-xs sm:text-sm font-bold">
                      EXPEN (MST Testnet ERC-20) / USD Fiat
                    </td>
                  </tr>
                  {product.specs &&
                    Object.entries(product.specs).map(([specKey, specVal], idx) => (
                      <tr
                        key={specKey}
                        className={idx % 2 === 0 ? "bg-zinc-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 font-medium text-zinc-600 capitalize text-xs sm:text-sm font-body">
                          {specKey.replace(/([A-Z])/g, " $1")}
                        </td>
                        <td className="px-6 py-4 text-zinc-900 font-mono text-xs sm:text-sm font-semibold">
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
