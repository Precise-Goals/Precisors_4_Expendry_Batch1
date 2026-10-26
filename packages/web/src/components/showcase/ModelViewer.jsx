"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { getModelById, generateFallbackGeometry } from "@/data/models";
import PlaceholderGeometry from "./PlaceholderGeometry";

/**
 * Draco compression decoder loader stub for lightweight GLB assets.
 * Configures Google Draco WASM decoder path when external meshes are loaded.
 */
export function initDracoLoader() {
  return {
    isConfigured: true,
    decoderPath: "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
    preload: () => true,
    dispose: () => true,
  };
}

export default function ModelViewer({
  modelId = "lathe-body",
  autoRotate = true,
  className = "",
}) {
  const model = getModelById(modelId) || generateFallbackGeometry(modelId);
  const controls = model.orbitControls || {
    minDistance: 2.0,
    maxDistance: 15.0,
    maxPolarAngle: Math.PI / 2 + 0.1,
    enableDamping: true,
    dampingFactor: 0.05,
  };

  return (
    <div
      className={`relative w-full h-full min-h-[380px] bg-neutral-950 rounded-2xl overflow-hidden select-none ${className}`}
      aria-label={`3D inspection view of ${model.name}`}
      role="region"
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/80 text-neutral-400 gap-3">
            <svg
              className="w-8 h-8 animate-spin text-[#26d464]"
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
            <span className="text-xs font-mono">Loading 3D Canvas...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [3, 2.5, 4.5], fov: 42 }}
          dpr={[1, 2]} // Clamp high-DPI display density to prevent GPU memory exhaustion
          shadows
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Three-point HDR lighting for industrial steel tooling */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-8, -6, -6]} intensity={0.5} />
          <pointLight position={[0, 4, 2]} intensity={0.9} color="#26d464" />

          {/* 3D Tool Model Geometry */}
          <PlaceholderGeometry modelId={modelId} autoRotate={autoRotate} />

          {/* Interactive Inspection Orbit Controls */}
          <OrbitControls
            enableDamping={controls.enableDamping}
            dampingFactor={controls.dampingFactor}
            minDistance={controls.minDistance}
            maxDistance={controls.maxDistance}
            maxPolarAngle={controls.maxPolarAngle}
          />
        </Canvas>
      </Suspense>

      {/* Control Overlay Hint */}
      <div className="absolute bottom-3 left-3 z-10 text-[11px] font-mono text-neutral-500 bg-neutral-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-neutral-800 pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#26d464]"></span>
        <span>Left-click drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
}
