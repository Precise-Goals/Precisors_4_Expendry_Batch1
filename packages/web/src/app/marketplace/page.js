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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#262626]">
          <div className="text-xs text-[#a1a1aa] font-mono">
            Catalog Inventory:{" "}
            <span className="text-[#ededed] font-bold">
              {filteredProducts.length}
            </span>{" "}
            items verified
            {selectedCategory !== "All" && (
              <span className="ml-1 text-[#26d464]">in {selectedCategory}</span>
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
              className="bg-[#121212] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#26d464] w-full sm:w-60 font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[#ededed] text-xs font-medium transition"
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
          <div className="text-center py-20 px-4 rounded-xl border border-dashed border-[#262626] bg-[#0e0e0e]">
            <h3 className="text-base font-semibold text-[#ededed]">
              No matching tooling products found in crib
            </h3>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Try adjusting your category filter, price bounds, or search keywords.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-[#161616] border border-[#262626] text-[#ededed] text-xs font-medium hover:bg-[#202020] transition"
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
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] pt-16 bg-blueprint-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#262626]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26d464] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#26d464] font-semibold">
                ISO 2768-mK Vetted Tooling Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-montserrat">
              Machining & Tooling Marketplace
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-1 max-w-2xl">
              Precision carbide cutters, modular vises, metrology tools, and
              accessories vetted by shop-floor veterans. Dual priced in USD and EXPEN.
            </p>
          </div>

          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#26d464] hover:bg-[#1a1a1a] hover:border-[#26d464]/60 transition text-sm font-semibold self-start md:self-auto shadow-sm"
          >
            <IconCube3D className="w-4 h-4 text-[#26d464]" />
            <span>Launch 3D Tooling Showcase</span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-[#121212] border border-[#262626] animate-pulse"
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
