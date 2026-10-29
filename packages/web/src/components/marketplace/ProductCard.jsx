import Link from "next/link";
import Image from "next/image";
import { IconCube3D } from "@/components/ui/Icons";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg==";

export default function ProductCard({ product }) {
  if (!product) return null;

  const expenEquivalent = (product.price * 2).toFixed(0);
  const refCode = `REF: EXP-MD-${product.id.toUpperCase()}`;

  return (
    <article className="flex flex-col rounded-3xl border border-zinc-200/90 bg-white hover:border-emerald-500/60 transition-all duration-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 motion-reduce:hover:translate-y-0 shadow-sm">
      {/* Packaging Frame / Visual Viewport */}
      <div className="relative h-52 w-full bg-zinc-50 border-b border-zinc-200 flex items-center justify-center overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300 motion-reduce:group-hover:scale-100"
        />

        {product.has3DModel && (
          <Link
            href={`/showcase?model=${product.modelId || "excel-mpk"}`}
            className="absolute top-3 right-3 text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1.5 hover:bg-emerald-100 hover:border-emerald-300 transition shadow-xs z-10 group/inspect"
            title="Inspect precision implant in 3D WebGL CAD viewport"
          >
            <IconCube3D className="w-3.5 h-3.5 text-emerald-700 group-hover/inspect:rotate-12 transition-transform" />
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>3D INSPECT</span>
          </Link>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
            {product.category}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {refCode}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 font-montserrat tracking-tight leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed font-body">
            {product.description}
          </p>

          {/* Specs Teaser Matrix */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(product.specs)
                .slice(0, 2)
                .map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[11px] font-mono bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded"
                  >
                    {key}: <span className="text-zinc-900 font-semibold">{val}</span>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-400 block">Unit Cost</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-zinc-900 font-montserrat tracking-tight">
                ${product.price}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                ({expenEquivalent} EXPEN)
              </span>
            </div>
          </div>

          <Link
            href={`/marketplace/${product.id}`}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-montserrat font-bold transition shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
