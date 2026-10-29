"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { getModelById, generateFallbackGeometry } from "@/data/models";
import PlaceholderGeometry from "./PlaceholderGeometry";

/**
 * Renders an interactive 3D GLB model using Three.js useGLTF and Center.
 * Applies wireframe toggling, material adjustments, and smooth rotation.
 */
function GLBMesh({ url, wireframe, autoRotate }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();

  // Clone scene so mutations / wireframes don't corrupt cached GLTF tree
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  // Compute bounding box and normalize scale so ALL models are zoomed-in and prominent
  const scale = useMemo(() => {
    if (!clonedScene) return 1;
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 3.0 / maxDim : 1;
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            mat.wireframe = wireframe;
            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
              if (mat.roughness === undefined || mat.roughness > 0.4) mat.roughness = 0.22;
              if (mat.metalness === undefined || mat.metalness < 0.6) mat.metalness = 0.9;
            }
          });
        }
      });
    }
  }, [clonedScene, wireframe]);

  if (!clonedScene) return null;

  return (
    <group ref={meshRef} scale={[scale, scale, scale]}>
      <Center top={false}>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

/**
 * Draco compression decoder loader stub for lightweight GLB assets.
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
  modelId = "excel-mpk",
  autoRotate = true,
  className = "",
}) {
  const model = getModelById(modelId) || generateFallbackGeometry(modelId);
  const controls = model.orbitControls || {
    minDistance: 0.8,
    maxDistance: 12.0,
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

  const toleranceLabel =
    model.specs?.tolerance ||
    model.specs?.millingTolerance ||
    model.specs?.surfaceFinish ||
    "ISO 13485 Precision (±0.005mm)";

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full min-h-[420px] bg-[#09090b] rounded-2xl overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-[#16a34a] border border-[#27272a] shadow-xl ${className}`}
      aria-label="3D model viewer CAD workstation"
      aria-roledescription="3D model viewer"
      role="region"
    >
      {/* Top Viewport Telemetry Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 bg-gradient-to-b from-[#09090b]/95 to-transparent flex items-center justify-between text-[11px] font-mono pointer-events-none border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[#16a34a] font-bold">
            CAD-3D: {model.shortName || model.name}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#ea580c] hidden sm:inline font-mono">
            GLB ASSET {"//"} {model.geometryType?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-[#a1a1aa]">
          <span className="flex items-center gap-1 text-[#16a34a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            60 FPS
          </span>
          <span className="text-zinc-600">·</span>
          <span>PBR: {model.materials?.metalness ?? 0.95}</span>
        </div>
      </div>

      {/* CAD Coordinate Ticks & Crosshair Markers */}
      <div aria-hidden="true" className="pointer-events-none select-none text-[10px] font-mono text-zinc-500">
        <span className="absolute top-10 left-3">+ [X: 00.00]</span>
        <span className="absolute top-10 right-3">+ [Y: 00.00]</span>
        <span className="absolute bottom-14 left-3">+ [Z: 00.00]</span>
        <span className="absolute bottom-14 right-3 text-[#ea580c]/80">+ [DATUM A]</span>
      </div>

      {/* Dimensional Caliper Dynamic HUD Lines Overlay */}
      {showCalipers && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none z-10">
          <div className="absolute top-14 left-1/4 right-1/4 flex flex-col items-center">
            <div className="w-full h-px bg-[#16a34a]/50 relative">
              <span className="absolute -left-1 -top-1.5 h-3 w-px bg-[#16a34a]" />
              <span className="absolute -right-1 -top-1.5 h-3 w-px bg-[#16a34a]" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#16a34a] bg-[#09090b]/90 px-2 py-0.5 rounded border border-[#16a34a]/40 -mt-2.5 shadow-sm">
              TOLERANCE: {toleranceLabel}
            </span>
          </div>

          <div className="absolute top-1/3 bottom-1/3 right-8 flex items-center">
            <div className="h-full w-px bg-[#ea580c]/50 relative flex items-center">
              <span className="absolute -top-1 -left-1.5 w-3 h-px bg-[#ea580c]" />
              <span className="absolute -bottom-1 -left-1.5 w-3 h-px bg-[#ea580c]" />
              <span className="text-[9px] font-mono text-[#ea580c] bg-[#09090b]/90 px-1.5 py-0.5 rounded border border-[#ea580c]/40 -rotate-90 -translate-x-6 whitespace-nowrap shadow-sm">
                BIOMEDICAL ALLOY
              </span>
            </div>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b]/90 text-[#a1a1aa] gap-3">
            <svg
              className="w-8 h-8 animate-spin text-[#16a34a]"
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
            <span className="text-xs font-mono">Loading 3D CAD Mesh...</span>
          </div>
        }
      >
        <Canvas
          key={cameraKey}
          camera={{
            position: [0, 0.2, 2.5],
            fov: 42,
          }}
          className="cursor-grab active:cursor-grabbing w-full h-full"
        >
          {/* Workstation Lighting Rig */}
          <ambientLight intensity={lightingPreset === "laser" ? 0.55 : lightingPreset === "studio" ? 0.95 : 0.75} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={lightingPreset === "laser" ? 1.8 : lightingPreset === "studio" ? 2.5 : 1.9}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* Calibrated orange/white rim-light */}
          <directionalLight position={[-8, -6, -6]} intensity={0.9} color="#ea580c" />
          <pointLight
            position={[0, 4, 2]}
            intensity={lightingPreset === "laser" ? 2.2 : 1.1}
            color={lightingPreset === "laser" ? "#16a34a" : lightingPreset === "studio" ? "#ffffff" : "#ea580c"}
          />

          {/* 3D Model Geometry with Keyboard Rotation Wrapper */}
          <group rotation={[rotation.x, rotation.y, 0]}>
            {model.glbPath ? (
              <Suspense
                fallback={
                  <PlaceholderGeometry
                    modelId={modelId}
                    autoRotate={isRotating}
                    wireframe={isWireframe}
                  />
                }
              >
                <GLBMesh
                  url={model.glbPath}
                  wireframe={isWireframe}
                  autoRotate={isRotating}
                />
              </Suspense>
            ) : (
              <PlaceholderGeometry
                modelId={modelId}
                autoRotate={isRotating}
                wireframe={isWireframe}
              />
            )}
          </group>

          {/* Interactive Inspection Orbit Controls */}
          <OrbitControls
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={0.8}
            maxDistance={6.0}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
        </Canvas>
      </Suspense>

      {/* Tactile CAD Controls Bar (Bottom) */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left Toggles */}
        <div className="flex items-center gap-1.5 bg-[#18181b]/95 backdrop-blur px-2 py-1 rounded-lg border border-[#27272a]">
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              isRotating
                ? "bg-[#16a34a]/20 text-[#16a34a] border border-[#16a34a]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#27272a]"
            }`}
          >
            Auto-Rotate: {isRotating ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setIsWireframe((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              isWireframe
                ? "bg-[#16a34a]/20 text-[#16a34a] border border-[#16a34a]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#27272a]"
            }`}
          >
            Wireframe: {isWireframe ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setShowCalipers((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              showCalipers
                ? "bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/40"
                : "text-[#a1a1aa] hover:text-white bg-[#27272a]"
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
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-white bg-[#27272a] border border-[#3f3f46] hover:border-[#16a34a]/40 transition-all capitalize"
          >
            Light: {lightingPreset}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-2 py-1 rounded text-[11px] font-mono font-medium text-[#a1a1aa] hover:text-white bg-[#27272a] transition-all"
          >
            Reset
          </button>
        </div>

        {/* Right Hint */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] bg-[#18181b]/95 backdrop-blur px-2.5 py-1 rounded-lg border border-[#27272a]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse"></span>
          <span>Left-click: Rotate · Scroll: Zoom · Arrow keys: ±15°</span>
        </div>
      </div>
    </div>
  );
}
