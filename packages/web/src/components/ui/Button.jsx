"use client";

import React from "react";

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    isLoading = false,
    className = "",
    type = "button",
    onClick,
    onKeyDown,
    ...props
  },
  ref
) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.97] active:duration-75 focus:outline-none focus:ring-2 focus:ring-[#26d464] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none";

  const variants = {
    primary:
      "bg-[#26d464] text-black font-semibold hover:bg-[#21b856] active:bg-[#1fa34c] shadow-md shadow-[#26d464]/10 hover:shadow-[#26d464]/20",
    secondary:
      "bg-[#161616] text-[#ededed] border border-[#262626] hover:bg-[#202020] hover:border-[#383838] hover:text-white active:bg-[#121212] shadow-sm",
    ghost:
      "bg-transparent text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#161616] active:bg-[#121212]",
    tech:
      "bg-[#091522] text-[#38bdf8] border border-[#0284c7]/40 hover:bg-[#0c1e33] hover:border-[#38bdf8]/60 shadow-sm shadow-[#38bdf8]/10 active:bg-[#060e18]",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:bg-red-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 font-mono",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-montserrat uppercase tracking-wider font-semibold",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  const handleKeyDown = (e) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      onClick={disabled || isLoading ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
