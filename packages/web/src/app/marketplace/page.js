import React, { Suspense } from "react";
import Link from "next/link";
import { PRODUCTS, filterProducts } from "@/data/products";
import ProductCard from "@/components/marketplace/ProductCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import { IconCube3D } from "@/components/ui/Icons";

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
    <div className="flex flex-col lg:flex-row gap-8 py-8 items-start">
      {/* Sidebar Filter Form: Tooling Crib Drawer Index */}
      <div className="w-full lg:w-64 shrink-0">
        <FilterSidebar
          selectedCategory={selectedCategory}
          minPrice={minPrice !== undefined ? String(minPrice) : ""}
          maxPrice={maxPrice !== undefined ? String(maxPrice) : ""}
          search={search}
        />
      </div>

      {/* Main Catalog Viewport */}
      <div className="flex-1 w-full space-y-6">
        {/* Search and Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="text-xs text-zinc-700 font-mono">
            Catalog Inventory:{" "}
            <span className="text-zinc-950 font-bold">
              {filteredProducts.length}
            </span>{" "}
            items verified
            {selectedCategory !== "All" && (
              <span className="ml-1 text-emerald-800 font-bold">in {selectedCategory}</span>
            )}
          </div>

          <form
            method="GET"
            action="/marketplace"
            className="flex items-center gap-2"
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
              placeholder="Search by alloy, standard, tool..."
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-950 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 w-full sm:w-64 font-mono transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-montserrat transition shadow-md active:scale-[0.98] cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/70 p-8">
            <h3 className="text-base font-bold text-zinc-950 font-montserrat">
              No matching tooling products found in crib
            </h3>
            <p className="text-xs text-zinc-700 font-body mt-1">
              Try adjusting your category filter, price bounds, or search keywords.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-block px-5 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-bold font-montserrat hover:bg-emerald-900 transition active:scale-[0.98]"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage({ searchParams }) {
  return (
    <div className="min-h-screen bg-transparent text-zinc-900 pt-16 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold">
                ISO 2768-mK Vetted Tooling Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 font-montserrat">
              Machining &amp; Tooling Marketplace
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 font-body mt-2 max-w-2xl">
              Precision carbide cutters, modular vises, metrology tools, and
              medical implants vetted by shop-floor veterans. Dual priced in USD and EXPEN.
            </p>
          </div>

          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full liquid-glass-pill text-zinc-950 hover:text-emerald-900 transition text-xs font-bold font-montserrat self-start md:self-auto shadow-sm active:scale-[0.98]"
          >
            <IconCube3D className="w-4 h-4 text-emerald-800" />
            <span>Launch 3D Tooling Showcase</span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl bg-zinc-50 border border-zinc-200 animate-pulse"
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
