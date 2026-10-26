import React, { Suspense } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, filterProducts } from "@/data/products";

export const metadata = {
  title: "Tooling Marketplace — Expendry",
  description:
    "Industrial CNC tooling, solid carbide cutters, workholding, and metrology instruments with 3D model inspection.",
};

async function MarketplaceCatalog({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "All";
  const minPrice = params?.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params?.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const search = params?.search || "";

  const filteredProducts = filterProducts(PRODUCTS, {
    category: selectedCategory,
    minPrice,
    maxPrice,
    search,
  });

  return (
    <>
      {/* Filter Navigation Bar */}
      <div className="py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const href =
              cat === "All"
                ? "/marketplace"
                : `/marketplace?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-[#26d464] text-neutral-950 font-semibold"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search and Price Quick Filters */}
        <form
          method="GET"
          action="/marketplace"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          {selectedCategory !== "All" && (
            <input
              type="hidden"
              name="category"
              value={selectedCategory}
            />
          )}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search tools..."
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#26d464] w-full sm:w-44"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition"
          >
            Filter
          </button>
          {(search || selectedCategory !== "All" || minPrice || maxPrice) && (
            <Link
              href="/marketplace"
              className="text-xs text-neutral-400 hover:text-neutral-200 underline ml-1"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Results Counter */}
      <div className="pb-4 text-xs text-neutral-400">
        Showing <span className="text-neutral-200 font-semibold">{filteredProducts.length}</span>{" "}
        machining products
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-xl border border-neutral-800 bg-[#0d0d0d] hover:border-neutral-700 transition-all duration-200 overflow-hidden group hover:shadow-xl"
            >
              {/* Image Placeholder Frame */}
              <div className="relative h-48 w-full bg-neutral-900/80 border-b border-neutral-800/80 flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-center text-neutral-500 group-hover:scale-110 group-hover:text-[#26d464] transition-transform duration-300">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26d464] animate-pulse"></span>
                    3D Model
                  </span>
                )}

                <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 rounded bg-neutral-950/80 text-neutral-300 border border-neutral-800">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-100 group-hover:text-[#26d464] transition line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500 block">Price</span>
                    <span className="text-lg font-bold text-white">
                      ${product.price.toFixed(2)}
                    </span>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20">
          <h3 className="text-base font-semibold text-neutral-300">
            No matching tooling products found
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your category filter, price bounds, or search keywords.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700 transition"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </>
  );
}

export default function MarketplacePage({ searchParams }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464]">
                Tooling Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-montserrat">
              Machining & Tooling Marketplace
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Precision carbide cutters, modular vises, metrology tools, and
              accessories vetted by shop-floor veterans.
            </p>
          </div>

          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-[#26d464] hover:bg-neutral-800 hover:border-[#26d464]/60 transition text-sm font-medium self-start md:self-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            <span>Open 3D Model Showcase</span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-neutral-900/50 border border-neutral-800 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <MarketplaceCatalog searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
