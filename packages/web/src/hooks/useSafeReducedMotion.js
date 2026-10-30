"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};

/**
 * useSafeReducedMotion
 *
 * Prevents React 19 / Next.js SSR hydration mismatches when prefers-reduced-motion is active.
 *
 * Framer-motion's useReducedMotion() returns null on the server, but returns true on client
 * devices where reduced motion is enabled. When components calculate initial/hidden variant
 * positions based on this hook (e.g. `y: shouldReduceMotion ? 0 : 16`), the server renders
 * `transform: translateY(16px)` while client hydration immediately computes `transform: none`,
 * triggering a hard React hydration mismatch error.
 *
 * Uses React 18/19 `useSyncExternalStore` with server snapshot `false` and client snapshot `true`.
 * This guarantees returning `false` during SSR and initial hydration render, ensuring
 * server and client HTML/style trees match 100%, without triggering ESLint cascading-render errors.
 */
export function useSafeReducedMotion() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const shouldReduce = useReducedMotion();

  return isClient ? Boolean(shouldReduce) : false;
}

export default useSafeReducedMotion;
