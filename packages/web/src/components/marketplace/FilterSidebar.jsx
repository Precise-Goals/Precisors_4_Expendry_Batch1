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
      className={`rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
        <h2 className="text-sm font-bold text-zinc-900 font-montserrat flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-700"
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
            className="text-xs font-mono text-zinc-600 hover:text-emerald-800 font-semibold transition"
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
          <legend className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider mb-2">
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
                    className="w-4 h-4 accent-emerald-700 cursor-pointer"
                  />
                  <label
                    htmlFor={inputId}
                    className={`text-xs cursor-pointer select-none transition-colors ${
                      isChecked
                        ? "text-emerald-900 font-bold"
                        : "text-zinc-800 hover:text-emerald-900 font-semibold"
                    }`}
                  >
                    {cat}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Price Range Filter Fieldset */}
        <fieldset className="space-y-3 pt-4 border-t border-zinc-200">
          <legend className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider mb-2">
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
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 font-mono placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition"
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
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 font-mono placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition"
              />
            </div>
          </div>
        </fieldset>

        {/* Form Action Controls */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-800 text-white font-montserrat font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
}
