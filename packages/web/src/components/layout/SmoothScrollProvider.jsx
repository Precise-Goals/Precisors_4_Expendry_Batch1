"use client";

import React, { useEffect, useRef } from "react";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

/**
 * High-Precision Non-Glitchy Inertial Smooth Scroll Engine
 * Preserves hardware-accelerated 120Hz trackpad scrolling while
 * smoothing stepped discrete mouse wheels with luxury deceleration.
 */
export default function SmoothScrollProvider({ children }) {
  const shouldReduceMotion = useSafeReducedMotion();
  const isScrolling = useRef(false);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion || typeof window === "undefined") return;

    // Detect touch device - preserve native momentum scrolling on touchscreens
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    currentY.current = window.scrollY;
    targetY.current = window.scrollY;

    const onWheel = (e) => {
      // Allow native scrolling inside nested containers (code blocks, textareas, chat viewports)
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

      // Trackpad detection: small, non-stepped deltas are handled natively by the browser compositor
      // Discrete wheel notches are typically multiples of 100 or >= 40
      const isTrackpad = Math.abs(e.deltaY) < 35 || Math.abs(e.deltaY) % 1 !== 0;
      if (isTrackpad) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
        return;
      }

      // Stepped mouse wheel smoothing
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY.current = Math.max(0, Math.min(maxScroll, targetY.current + e.deltaY));

      if (!isScrolling.current) {
        isScrolling.current = true;
        rafId.current = requestAnimationFrame(render);
      }
    };

    const render = () => {
      // 0.12 factor gives snappy, responsive deceleration without lag
      currentY.current += (targetY.current - currentY.current) * 0.12;

      if (Math.abs(targetY.current - currentY.current) < 0.5) {
        currentY.current = targetY.current;
        window.scrollTo(0, currentY.current);
        isScrolling.current = false;
        return;
      }

      window.scrollTo(0, currentY.current);
      rafId.current = requestAnimationFrame(render);
    };

    const onScroll = () => {
      if (!isScrolling.current) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
