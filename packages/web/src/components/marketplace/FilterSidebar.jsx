import Link from "next/link";
import { CATEGORIES } from "@/data/products";

export default function FilterSidebar({
  selectedCategory = "All",
  minPrice = "",
  maxPrice = "",
  search = "",
  className = "",
}) {
  return (
    <aside
      aria-label="Product filters"
      className={`rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-5 ${className}`}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#26d464]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter Catalog
        </h2>

        {(selectedCategory !== "All" || minPrice || maxPrice || search) && (
          <Link
            href="/marketplace"
            className="text-xs text-neutral-400 hover:text-[#26d464] transition"
          >
            Clear all
          </Link>
        )}
      </div>

      <form method="GET" action="/marketplace" className="space-y-6">
        {/* Preserve search term if present */}
        {search && <input type="hidden" name="search" value={search} />}

        {/* Category Filter Fieldset */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Tooling Category
          </legend>

          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isChecked = selectedCategory === cat;
              const inputId = `filter-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <div key={cat} className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    id={inputId}
                    name="category"
                    value={cat}
                    defaultChecked={isChecked}
                    className="w-4 h-4 accent-[#26d464] bg-neutral-900 border-neutral-700 cursor-pointer"
                  />
                  <label
                    htmlFor={inputId}
                    className="text-xs text-neutral-300 hover:text-white cursor-pointer select-none"
                  >
                    {cat}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Price Range Filter Fieldset */}
        <fieldset className="space-y-3 pt-4 border-t border-neutral-800">
          <legend className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Price Range ($)
          </legend>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-min-price" className="sr-only">
                Minimum price
              </label>
              <input
                type="number"
                id="filter-min-price"
                name="minPrice"
                min="0"
                step="1"
                placeholder="Min ($)"
                defaultValue={minPrice}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#26d464]"
              />
            </div>
            <div>
              <label htmlFor="filter-max-price" className="sr-only">
                Maximum price
              </label>
              <input
                type="number"
                id="filter-max-price"
                name="maxPrice"
                min="0"
                step="1"
                placeholder="Max ($)"
                defaultValue={maxPrice}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#26d464]"
              />
            </div>
          </div>
        </fieldset>

        {/* Form Action Controls */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#26d464] text-neutral-950 font-bold text-xs hover:bg-[#20b855] transition shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
}
