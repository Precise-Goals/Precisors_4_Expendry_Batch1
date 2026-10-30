"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * Magnetic Element Tracking & Specular Reflection Engine
 * Emil Kowalski design engineering pattern:
 * - Gently pulls element towards cursor on proximity
 * - Projects dynamic radial specular sheen (Machining Green + Calibrated Orange)
 * - Restores with fluid damped spring physics on exit
 */
export function MagneticTrack({
  children,
  strength = 0.25,
  specular = true,
  className = "",
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useSafeReducedMotion();
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Fluid spring configuration (Emil Kowalski micro-physics profile)
  const springConfig = { damping: 20, stiffness: 320, mass: 0.6 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    rawX.set(deltaX);
    rawY.set(deltaY);

    if (specular) {
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty("--mouse-x", `${relX}%`);
      ref.current.style.setProperty("--mouse-y", `${relY}%`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      className={`relative transition-shadow duration-300 ${className} ${
        specular ? "specular-interactive" : ""
      }`.trim()}
      {...props}
    >
      {specular && isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-100 transition-opacity duration-300 overflow-hidden"
          style={{
            background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(38, 212, 100, 0.1), rgba(249, 115, 22, 0.06), transparent 75%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}

export default MagneticTrack;
