"use client";

import { useState } from "react";

export default function BuyButton({ product }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={isProcessing}
      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#26d464] text-neutral-950 font-bold text-sm hover:bg-[#20b855] transition shadow-lg shadow-[#26d464]/10 flex items-center justify-center gap-2"
    >
      <span>Instant Order</span>
      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-[#26d464]">
        Demo
      </span>
    </button>
  );
}
