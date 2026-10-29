"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * High-Performance Inertial Smooth Scroll Engine (Lenis-inspired)
 * Provides butter-smooth inertial scroll interpolation via requestAnimationFrame,
 * gracefully falling back on touch devices and prefers-reduced-motion.
 */
export default function SmoothScrollProvider({ children }) {
  const shouldReduceMotion = useReducedMotion();
  const rafId = useRef(null);
  const scrollTarget = useRef(0);
  const currentScroll = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    // Disable on reduced-motion or non-browser environments
    if (shouldReduceMotion || typeof window === "undefined") return;

    // Detect touch device - preserve native momentum scrolling on touchscreens
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    currentScroll.current = window.scrollY;
    scrollTarget.current = window.scrollY;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const onWheel = (e) => {
      // Do not override if user is scrolling inside a nested scrollable container (e.g. modal, code block)
      let target = e.target;
      while (target && target !== document.body) {
        if (target.scrollHeight > target.clientHeight) {
          const style = window.getComputedStyle(target);
          if (style.overflowY === "auto" || style.overflowY === "scroll") {
            return;
          }
        }
        target = target.parentElement;
      }

      // Smooth scroll delta clamp
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + e.deltaY));

      if (!isScrolling.current) {
        isScrolling.current = true;
        rafId.current = requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      // 0.09 easing factor provides crisp, high-response luxury deceleration
      currentScroll.current = lerp(currentScroll.current, scrollTarget.current, 0.09);

      if (Math.abs(scrollTarget.current - currentScroll.current) < 0.5) {
        currentScroll.current = scrollTarget.current;
        window.scrollTo(0, currentScroll.current);
        isScrolling.current = false;
        return;
      }

      window.scrollTo(0, currentScroll.current);
      rafId.current = requestAnimationFrame(updateScroll);
    };

    const onNativeScroll = () => {
      if (!isScrolling.current) {
        currentScroll.current = window.scrollY;
        scrollTarget.current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
