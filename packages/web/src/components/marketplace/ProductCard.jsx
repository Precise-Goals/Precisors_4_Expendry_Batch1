import Link from "next/link";
import Image from "next/image";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzEyMTIxMiIvPjwvc3ZnPg==";

export default function ProductCard({ product }) {
  if (!product) return null;

  const expenEquivalent = (product.price * 2).toFixed(0);
  const refCode = `REF: EXP-TL-${product.id.toUpperCase()}`;

  return (
    <article className="flex flex-col rounded-2xl border border-[#262626] bg-[#121212] hover:border-[#383838] transition-all duration-200 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 motion-reduce:hover:translate-y-0 specular-card">
      {/* Packaging Frame / Visual Viewport */}
      <div className="relative h-48 w-full bg-[#0a0a0a] border-b border-[#222222] flex items-center justify-center overflow-hidden">
        {/* Specular radial highlight behind image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-radial from-white/[0.03] to-transparent pointer-events-none"
        />

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
            href={`/showcase?model=${product.modelId || "lathe-body"}`}
            className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#26d464]/20 text-[#26d464] border border-[#26d464]/40 font-semibold flex items-center gap-1.5 hover:bg-[#26d464]/30 transition shadow-sm z-10"
            title="Inspect tool in 3D WebGL viewport"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <span>3D INSPECTION READY</span>
          </Link>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-[#ededed] border border-[#262626]">
            {product.category}
          </span>
          <span className="text-[9px] font-mono text-[#71717a]">
            {refCode}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#ededed] group-hover:text-[#26d464] transition line-clamp-2 font-display">
            {product.name}
          </h3>
          <p className="text-xs text-[#a1a1aa] mt-2 line-clamp-2 leading-relaxed">
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
                    className="text-[10px] font-mono bg-[#161616] border border-[#262626] text-[#a1a1aa] px-2 py-0.5 rounded"
                  >
                    {key}: <span className="text-[#ededed]">{val}</span>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-[#222222] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">Dual Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#26d464] font-mono font-semibold">
                // {expenEquivalent} EXPEN
              </span>
            </div>
          </div>

          <Link
            href={`/marketplace/${product.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#26d464] text-xs font-semibold text-[#ededed] hover:text-[#26d464] hover:bg-[#1a1a1a] transition active:scale-98 shadow-sm"
          >
            Inspect Tool
          </Link>
        </div>
      </div>
    </article>
  );
}
