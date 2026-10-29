import React from "react";
import Link from "next/link";
import { IconSpindle, IconCube3D, IconBrain, IconToken, IconExternal } from "@/components/ui/Icons";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "Manufacturing Heritage — Evolving from Biorad Medisys Pune | Expendry",
  description:
    "How Expendry's tokenized manufacturing tacit knowledge engine evolved from precision medical implant machining at Biorad Medisys Pvt Ltd Pune.",
};

export default function HeritagePage() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-900 pt-4 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* 1. Hero Section */}
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border border-zinc-200/90 overflow-hidden bg-white/90 backdrop-blur-xl rounded-4xl max-w-6xl mx-auto my-6 shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Origin &amp; Foundation Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 font-montserrat">
            Evolving from <span className="text-emerald-700">Biorad Medisys</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 font-body leading-relaxed">
            From the high-precision CNC shop-floors of Pune, India, to a global decentralized
            manufacturing tacit knowledge engine on MST blockchain.
          </p>

          <div className="pt-2">
            <a
              href="https://www.bioradmedisys.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-mono font-bold transition shadow-xs cursor-pointer"
            >
              <span>Visit Biorad Medisys Official Site (bioradmedisys.com)</span>
              <IconExternal className="w-4 h-4 text-emerald-700" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. The Pune Precision Engineering Genesis */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800">
              The Manufacturing Challenge
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Where Microns Mean Human Mobility
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-body">
              Headquartered in Pune, Maharashtra, <strong>Biorad Medisys Pvt Ltd</strong> has spent over two
              decades pioneering indigenous medical devices in India — from orthopedic total knee and hip replacement
              implants (like the <em>Genius</em>, <em>Ouro</em>, and <em>Signature</em> systems) to advanced
              endosurgical instruments and hydrophilic ureteral stents.
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed font-body">
              Machining surgical CoCrMo alloys and titanium Ti-6Al-4V ELI demands tolerances under
              ±0.005mm and mirror surface finishes of Ra &lt; 0.02 µm. Veteran machinists across Pune's industrial
              clusters (Pimpri-Chinchwad, Bhosari, Chakan) accumulated decades of unwritten rules:
              how to damp chatter harmonics on knee condyles, offset thermal spindle drift at dawn, and avoid micro-notching on carbide inserts.
            </p>
          </div>

          <div className="p-8 rounded-4xl bg-white border border-zinc-200/90 shadow-xl space-y-6">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-md">
                <IconSpindle className="w-6 h-6 text-white" />
              </span>
              <div>
                <h3 className="text-base font-bold text-zinc-900 font-montserrat">
                  Biorad Medisys Pvt Ltd
                </h3>
                <span className="text-xs font-mono text-zinc-500 font-medium">Pune, Maharashtra, India</span>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono text-zinc-800 border-t border-zinc-100 pt-4">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Primary Manufacturing:</span>
                <span className="font-bold text-zinc-900">Orthopedics, Endosurgery, Stents</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Machining Infrastructure:</span>
                <span className="font-bold text-zinc-900">5-Axis VMC, Swiss-Turn, Laser EDM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Standard Compliance:</span>
                <span className="font-bold text-zinc-900">ISO 13485, CE 0434, CDSCO</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Tacit Bottleneck:</span>
                <span className="text-amber-800 font-bold">Uncodified Machinist Wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Pillars of Evolution to Expendry */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              How Expendry Evolved the Shop-Floor
            </h2>
            <p className="text-sm text-zinc-600 font-body">
              Expendry bridges the gap between physical CNC craftsmanship and digital cryptographic intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                <IconBrain className="w-6 h-6 text-emerald-700" />
              </span>
              <h3 className="text-lg font-bold text-zinc-900 font-montserrat">
                1. Tacit Knowledge Codex
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                Instead of losing machinist tricks when veteran operators retire, setups, feed rates,
                and fixture blueprints are indexed into a neural BM25 knowledge engine powered by Sarvam AI.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                <IconToken className="w-6 h-6 text-emerald-700" />
              </span>
              <h3 className="text-lg font-bold text-zinc-900 font-montserrat">
                2. MST On-Chain Incentives
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                Every verified contribution mints EXPEN tokens on MST Testnet (Chain ID 91562037).
                Machinists own their intellectual property and earn daily token allocations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                <IconCube3D className="w-6 h-6 text-emerald-700" />
              </span>
              <h3 className="text-lg font-bold text-zinc-900 font-montserrat">
                3. Real 3D CAD Inspection
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                Real GLB CAD meshes of the actual implants manufactured in Pune are rendered in real-time
                with WebGL calipers, PBR shaders, and wireframe analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 9 Precision Implants Showcase */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800">
              Implant Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat mt-1">
              9 Biorad Medisys Products in 3D
            </h2>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
          >
            <span>Browse Full 3D Marketplace</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold uppercase">
                  {prod.category}
                </span>
                <span className="text-xs font-mono text-emerald-800 font-bold">3D Verified</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 font-montserrat line-clamp-1">
                  {prod.name}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-2 mt-1.5 font-body">
                  {prod.description}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-zinc-100">
                <span className="text-sm font-mono font-bold text-zinc-900">
                  ${prod.price.toFixed(2)}
                </span>
                <Link
                  href={`/showcase?model=${prod.modelId}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold transition shadow-xs"
                >
                  <IconCube3D className="w-3.5 h-3.5 text-white" />
                  <span>Inspect 3D</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Strip */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto my-8">
        <div className="rounded-4xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-2xl p-10 sm:p-14 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat tracking-tight text-zinc-900">
            Join the Manufacturing Revolution
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-body leading-relaxed max-w-2xl mx-auto">
            Whether you run a CNC lathe in Pune, program a 5-axis mill in Chennai, or design surgical
            tooling globally — claim your machinist profile on Expendry today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-montserrat transition shadow-lg shadow-emerald-950/20 active:scale-95"
            >
              Sign In to Machinist Portal →
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 text-xs font-bold font-montserrat transition shadow-xs"
            >
              Explore 3D Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
