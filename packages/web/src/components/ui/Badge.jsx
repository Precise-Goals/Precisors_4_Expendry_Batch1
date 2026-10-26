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
        typeStyles = "bg-blue-500/10 text-blue-400 border-blue-500/30";
        break;
      case "Blueprint":
        typeStyles = "bg-purple-500/10 text-purple-400 border-purple-500/30";
        break;
      case "Idea":
        typeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/30";
        break;
      case "Setup Tip":
        typeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
        break;
      case "Video Note":
        typeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/30";
        break;
      default:
        typeStyles = "bg-[#161616] text-[#a1a1aa] border-[#262626]";
    }
  }

  const variants = {
    default: "bg-[#161616] text-[#a1a1aa] border-[#262626]",
    accent: "bg-[#26d464]/10 text-[#26d464] border-[#26d464]/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
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
