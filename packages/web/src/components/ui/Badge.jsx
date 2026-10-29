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
        typeStyles = "bg-[#0284c7]/15 text-[#38bdf8] border-[#0284c7]/35";
        break;
      case "Blueprint":
        typeStyles = "bg-white/10 text-[#ededed] border-white/20";
        break;
      case "Idea":
        typeStyles = "bg-[#26d464]/15 text-[#26d464] border-[#26d464]/40";
        break;
      case "Setup Tip":
        typeStyles = "bg-[#26d464]/10 text-[#26d464] border-[#26d464]/30";
        break;
      case "Video Note":
        typeStyles = "bg-[#161616] text-[#ededed] border-[#262626]";
        break;
      default:
        typeStyles = "bg-[#161616] text-[#a1a1aa] border-[#262626]";
    }
  }

  const variants = {
    default: "bg-[#161616] text-[#a1a1aa] border-[#262626]",
    accent: "bg-[#26d464]/10 text-[#26d464] border-[#26d464]/30",
    success: "bg-[#26d464]/10 text-[#26d464] border-[#26d464]/30",
    tech: "bg-[#0284c7]/15 text-[#38bdf8] border-[#0284c7]/35",
    blue: "bg-[#0284c7]/15 text-[#38bdf8] border-[#0284c7]/35",
    contrast: "bg-white text-black font-semibold border-white",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
    outline: "bg-transparent text-[#ededed] border-[#383838]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const selectedVariant = typeStyles || variants[variant] || variants.default;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${selectedVariant} ${selectedSize} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
});

export default Badge;
