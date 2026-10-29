"use client";

import React from "react";

export const Card = React.forwardRef(function Card(
  {
    children,
    className = "",
    hoverable = false,
    interactive = false,
    onClick,
    onKeyDown,
    tabIndex,
    role,
    ...props
  },
  ref
) {
  const isClickable = interactive || Boolean(onClick);

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <div
      ref={ref}
      role={role || (isClickable ? "button" : undefined)}
      tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`rounded-xl border border-[#262626] bg-[#121212] ${
        className.includes("text-") ? "" : "text-white"
      } transition-all ${
        hoverable || isClickable
          ? "hover:border-[#3f3f46] hover:bg-[#161616] cursor-pointer"
          : ""
      } ${
        isClickable
          ? "focus:outline-none focus:ring-2 focus:ring-[#26d464] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = React.forwardRef(function CardHeader(
  { children, className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 border-b border-[#1c1c1c] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardTitle = React.forwardRef(function CardTitle(
  { children, className = "", as: Component = "h3", ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`font-semibold tracking-tight text-white font-display text-lg ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
});

export const CardDescription = React.forwardRef(function CardDescription(
  { children, className = "", ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={`text-sm text-[#a1a1aa] leading-relaxed ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
});

export const CardContent = React.forwardRef(function CardContent(
  { children, className = "", ...props },
  ref
) {
  return (
    <div ref={ref} className={`p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
});

export const CardFooter = React.forwardRef(function CardFooter(
  { children, className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
