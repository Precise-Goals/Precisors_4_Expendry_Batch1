import React from "react";

export const Badge = React.forwardRef(function Badge(
  { children, variant = "default", type, size = "md", className = "", ...props },
  ref
) {
  // If post type is provided, map to semantic type color
  let typeStyles = "";
  if (type) {
    switch (type) {
      case "Experience":
        typeStyles = "bg-orange-50 text-orange-800 border-orange-200";
        break;
      case "Blueprint":
        typeStyles = "bg-zinc-100 text-zinc-900 border-zinc-300 font-bold";
        break;
      case "Idea":
        typeStyles = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
        break;
      case "Setup Tip":
        typeStyles = "bg-emerald-50 text-emerald-800 border-emerald-200";
        break;
      case "Video Note":
        typeStyles = "bg-zinc-900 text-white border-zinc-700";
        break;
      default:
        typeStyles = "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  }

  const variants = {
    default: "bg-zinc-100 text-zinc-800 border-zinc-200",
    accent: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    tech: "bg-orange-50 text-orange-800 border-orange-200 font-semibold",
    orange: "bg-orange-50 text-orange-800 border-orange-200 font-semibold",
    warning: "bg-amber-50 text-amber-800 border-amber-200 font-semibold",
    contrast: "bg-zinc-900 text-white font-bold border-zinc-800",
    danger: "bg-red-50 text-red-800 border-red-200 font-semibold",
    outline: "bg-transparent text-zinc-800 border-zinc-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] font-mono",
    md: "px-2.5 py-1 text-xs font-mono",
    lg: "px-3 py-1.5 text-sm font-mono",
  };

  const selectedVariant = typeStyles || variants[variant] || variants.default;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 rounded-full border ${selectedVariant} ${selectedSize} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
});

export default Badge;
