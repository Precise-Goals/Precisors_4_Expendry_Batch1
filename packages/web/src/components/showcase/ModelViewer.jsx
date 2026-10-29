"use client";

import React, { Suspense, useState } from "react";
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

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isWireframe, setIsWireframe] = useState(false);
  const [showCalipers, setShowCalipers] = useState(true);
  const [lightingPreset, setLightingPreset] = useState("laser"); // toolroom, studio, laser
  const [cameraKey, setCameraKey] = useState(0);

  const STEP = (15 * Math.PI) / 180; // 15 degrees in radians

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setRotation((prev) => ({ ...prev, y: prev.y - STEP }));
        break;
      case "ArrowRight":
        e.preventDefault();
        setRotation((prev) => ({ ...prev, y: prev.y + STEP }));
        break;
      case "ArrowUp":
        e.preventDefault();
        setRotation((prev) => ({ ...prev, x: prev.x - STEP }));
        break;
      case "ArrowDown":
        e.preventDefault();
        setRotation((prev) => ({ ...prev, x: prev.x + STEP }));
        break;
      default:
        break;
    }
  };

  const handleResetView = () => {
    setRotation({ x: 0, y: 0 });
    setCameraKey((prev) => prev + 1);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full min-h-[420px] bg-[#080808] rounded-2xl overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-[#26d464] border border-[#262626] specular-card ${className}`}
      aria-label="3D model viewer CAD workstation"
      aria-roledescription="3D model viewer"
      role="region"
    >
      {/* Top Viewport Telemetry Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[#26d464] font-bold">
            {model.id === "lathe-body" ? "T-01" : "T-02"}: {model.name.toUpperCase()}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#f97316] hidden sm:inline font-mono">
            DRACO COMPRESSED {"//"} {model.geometryType?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-[#a1a1aa]">
          <span className="flex items-center gap-1 text-[#26d464]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
            60 FPS
          </span>
          <span className="text-zinc-600">·</span>
          <span>PBR: {model.materials?.metalness ?? 0.85}</span>
        </div>
      </div>

      {/* CAD Coordinate Ticks & Crosshair Markers */}
      <div aria-hidden="true" className="pointer-events-none select-none text-[10px] font-mono text-zinc-500">
        <span className="absolute top-10 left-3">+ [X: 00.00]</span>
        <span className="absolute top-10 right-3">+ [Y: 00.00]</span>
        <span className="absolute bottom-14 left-3">+ [Z: 00.00]</span>
        <span className="absolute bottom-14 right-3 text-[#f97316]/80">+ [DATUM A]</span>
      </div>

      {/* Dimensional Caliper Dynamic HUD Lines Overlay */}
      {showCalipers && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none z-10">
          <div className="absolute top-14 left-1/4 right-1/4 flex flex-col items-center">
            <div className="w-full h-px bg-[#26d464]/50 relative">
              <span className="absolute -left-1 -top-1.5 h-3 w-px bg-[#26d464]" />
              <span className="absolute -right-1 -top-1.5 h-3 w-px bg-[#26d464]" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#26d464] bg-[#0c0c0c]/90 px-2 py-0.5 rounded border border-[#26d464]/40 -mt-2.5 shadow-sm">
              OVERALL LENGTH: 125.00 mm (±0.005)
            </span>
          </div>

          <div className="absolute top-1/3 bottom-1/3 right-8 flex items-center">
            <div className="h-full w-px bg-[#f97316]/50 relative flex items-center">
              <span className="absolute -top-1 -left-1.5 w-3 h-px bg-[#f97316]" />
              <span className="absolute -bottom-1 -left-1.5 w-3 h-px bg-[#f97316]" />
              <span className="text-[9px] font-mono text-[#f97316] bg-[#0c0c0c]/90 px-1.5 py-0.5 rounded border border-[#f97316]/40 -rotate-90 -translate-x-6 whitespace-nowrap shadow-sm">
                SHANK: 25.00 h6
              </span>
            </div>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]/90 text-[#a1a1aa] gap-3">
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-xs font-mono">Compiling 3D Tool Geometry...</span>
          </div>
        }
      >
        <Canvas
          key={cameraKey}
          camera={{
            position: model.cameraPosition || [0, 0, 5],
            fov: 50,
          }}
          className="cursor-grab active:cursor-grabbing w-full h-full"
        >
          {/* Workstation Lighting Rig */}
          <ambientLight intensity={lightingPreset === "laser" ? 0.45 : lightingPreset === "studio" ? 0.85 : 0.65} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={lightingPreset === "laser" ? 1.6 : lightingPreset === "studio" ? 2.5 : 1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* Calibrated orange/white rim-light */}
          <directionalLight position={[-8, -6, -6]} intensity={0.8} color="#f97316" />
          <pointLight
            position={[0, 4, 2]}
            intensity={lightingPreset === "laser" ? 2.2 : 0.9}
            color={lightingPreset === "laser" ? "#26d464" : lightingPreset === "studio" ? "#ffffff" : "#f97316"}
          />

          {/* 3D Tool Model Geometry with Keyboard Rotation Wrapper */}
          <group rotation={[rotation.x, rotation.y, 0]}>
            <PlaceholderGeometry
              modelId={modelId}
              autoRotate={isRotating}
              wireframe={isWireframe}
            />
          </group>

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

      {/* Tactile CAD Controls Bar (Bottom) */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left Toggles */}
        <div className="flex items-center gap-1.5 bg-[#121212]/95 backdrop-blur px-2 py-1 rounded-lg border border-[#262626]">
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              isRotating
                ? "bg-[#26d464]/20 text-[#26d464] border border-[#26d464]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#1a1a1a]"
            }`}
          >
            Auto-Rotate: {isRotating ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setIsWireframe((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              isWireframe
                ? "bg-[#26d464]/20 text-[#26d464] border border-[#26d464]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#1a1a1a]"
            }`}
          >
            Wireframe: {isWireframe ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setShowCalipers((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              showCalipers
                ? "bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#1a1a1a]"
            }`}
          >
            Calipers: {showCalipers ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() =>
              setLightingPreset((prev) =>
                prev === "laser" ? "studio" : prev === "studio" ? "toolroom" : "laser"
              )
            }
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-white bg-[#1a1a1a] border border-[#333333] hover:border-[#26d464]/40 transition-all capitalize"
          >
            Light: {lightingPreset}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-[#a1a1aa] hover:text-white bg-[#1a1a1a] transition-all"
          >
            Reset
          </button>
        </div>

        {/* Right Hint */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] bg-[#121212]/95 backdrop-blur px-2.5 py-1 rounded-lg border border-[#262626]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse"></span>
          <span>Left-click: Rotate · Scroll: Zoom · Arrow keys: ±15°</span>
        </div>
      </div>
    </div>
  );
}
