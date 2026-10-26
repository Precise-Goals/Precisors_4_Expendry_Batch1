"use client";

import { useState } from "react";

export default function BuyButton({ product }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const handleBuy = () => {
    if (!product || isProcessing) return;

    setIsProcessing(true);

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORD-EXP-${Date.now()}-${randomSuffix}`;

    // Track analytics event if gtag is present
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      try {
        window.gtag("event", "purchase", {
          transaction_id: orderId,
          value: product.price,
          currency: "USD",
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              item_category: product.category,
            },
          ],
        });
      } catch {
        // Safe ignore
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
      setToast({
        orderId,
        message: `Purchase confirmed (demo mode) for ${product.name}`,
        price: product.price,
      });

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToast(null);
      }, 4000);
    }, 600);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <button
        type="button"
        onClick={handleBuy}
        disabled={isProcessing}
        aria-label={`Buy ${product?.name} in demo mode`}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#26d464] text-neutral-950 font-bold text-sm hover:bg-[#20b855] transition shadow-lg shadow-[#26d464]/10 flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <svg
              className="w-4 h-4 animate-spin motion-reduce:animate-none"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Processing Order...</span>
          </>
        ) : (
          <>
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Instant Demo Order</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-[#26d464]">
              Demo
            </span>
          </>
        )}
      </button>

      {/* Purchase Confirmation Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl bg-neutral-900 border border-[#26d464]/40 p-4 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-[#26d464]/20 border border-[#26d464]/40 flex items-center justify-center text-[#26d464] shrink-0 mt-0.5">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Purchase Confirmed
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#26d464]/10 text-[#26d464] border border-[#26d464]/20 rounded">
                Demo Mode
              </span>
            </h4>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {toast.message}
            </p>
            <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>{toast.orderId}</span>
              <span className="text-[#26d464] font-semibold">${toast.price.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-neutral-500 hover:text-neutral-300 -mr-1 -mt-1 p-1 text-xs"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
