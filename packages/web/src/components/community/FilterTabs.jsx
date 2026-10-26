"use client";

import React, { useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { POST_TYPES } from "shared/constants";

const ALL_TABS = ["All", ...POST_TYPES];

export default function FilterTabs({ activeType = "All", onSelectType }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabsRef = useRef([]);

  // Sync URL search param with selection
  const handleSelect = (tab) => {
    if (onSelectType) {
      onSelectType(tab);
    }

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (tab === "All") {
      current.delete("type");
    } else {
      current.set("type", tab);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  // Keyboard navigation for accessible tabs (arrow keys)
  const handleKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % ALL_TABS.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + ALL_TABS.length) % ALL_TABS.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = ALL_TABS.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    tabsRef.current[newIndex]?.focus();
    handleSelect(ALL_TABS[newIndex]);
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div
        role="tablist"
        aria-label="Filter posts by type"
        className="flex items-center gap-2 p-1.5 rounded-xl bg-[#121212] border border-[#262626] w-max min-w-full sm:min-w-0"
      >
        {ALL_TABS.map((tab, idx) => {
          const isSelected = activeType === tab;
          const tabId = `tab-${tab.toLowerCase().replace(/\s+/g, "-")}`;

          return (
            <button
              key={tab}
              ref={(el) => (tabsRef.current[idx] = el)}
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls="community-feed-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelect(tab)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#26d464] whitespace-nowrap select-none ${
                isSelected
                  ? "bg-[#26d464] text-black shadow-sm shadow-[#26d464]/20"
                  : "text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#1a1a1a]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
