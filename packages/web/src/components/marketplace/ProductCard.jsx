import Link from "next/link";

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <article className="flex flex-col rounded-xl border border-neutral-800 bg-[#0d0d0d] hover:border-neutral-700 transition-all duration-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      {/* Visual Frame */}
      <div className="relative h-48 w-full bg-neutral-900/80 border-b border-neutral-800/80 flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-center text-neutral-500 group-hover:scale-110 group-hover:text-[#26d464] transition-transform duration-300 motion-reduce:group-hover:scale-100">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {product.has3DModel && (
          <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#26d464]/20 text-[#26d464] border border-[#26d464]/30 font-semibold flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            ></span>
            3D Model
          </span>
        )}

        <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 rounded bg-neutral-950/80 text-neutral-300 border border-neutral-800">
          {product.category}
        </span>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-100 group-hover:text-[#26d464] transition line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Specs Teaser */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(product.specs)
                .slice(0, 2)
                .map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded"
                  >
                    {key}: <span className="text-neutral-200">{val}</span>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 block">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#26d464] font-mono">
                ({(product.price * 2).toFixed(0)} EXPEN)
              </span>
            </div>
          </div>

          <Link
            href={`/marketplace/${product.id}`}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-[#26d464] text-xs font-semibold text-[#26d464] hover:bg-[#26d464] hover:text-neutral-950 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
