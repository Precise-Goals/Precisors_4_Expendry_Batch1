"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { getModelById, generateFallbackGeometry } from "@/data/models";
import PlaceholderGeometry from "./PlaceholderGeometry";

/**
 * Error boundary that catches any Three.js GLTFLoader decoding or texture loading failures
 * and cleanly renders the procedural CAD fallback geometry.
 */
export class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Gracefully handle texture or GLTF parsing failure
    if (process.env.NODE_ENV !== "production") {
      console.warn("ModelErrorBoundary handled 3D mesh error, rendering fallback geometry:", error?.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

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
      className={`relative w-full h-full min-h-[420px] bg-gradient-to-b from-zinc-50/90 to-zinc-100/95 rounded-3xl overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-zinc-200/90 shadow-xl ${className}`}
      aria-label="3D model viewer CAD workstation"
      aria-roledescription="3D model viewer"
      role="region"
    >
      {/* Top Viewport Telemetry Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 bg-white/80 backdrop-blur-md flex items-center justify-between text-[11px] font-mono pointer-events-none border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="text-emerald-800 font-bold">
            CAD-3D: {model.shortName || model.name}
          </span>
          <span className="text-zinc-300">|</span>
          <span className="text-emerald-700 hidden sm:inline font-mono font-semibold">
            GLB ASSET {"//"} {model.geometryType?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-600 font-semibold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            60 FPS
          </span>
          <span className="text-zinc-300">·</span>
          <span>PBR: {model.materials?.metalness ?? 0.95}</span>
        </div>
      </div>

      {/* CAD Coordinate Ticks & Crosshair Markers */}
      <div aria-hidden="true" className="pointer-events-none select-none text-[10px] font-mono text-zinc-400 font-semibold">
        <span className="absolute top-11 left-3">+ [X: 00.00]</span>
        <span className="absolute top-11 right-3">+ [Y: 00.00]</span>
        <span className="absolute bottom-16 left-3">+ [Z: 00.00]</span>
        <span className="absolute bottom-16 right-3 text-emerald-800 font-bold">+ [DATUM A]</span>
      </div>

      {/* Dimensional Caliper Dynamic HUD Lines Overlay */}
      {showCalipers && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none z-10">
          <div className="absolute top-14 left-1/4 right-1/4 flex flex-col items-center">
            <div className="w-full h-px bg-emerald-600/50 relative">
              <span className="absolute -left-1 -top-1.5 h-3 w-px bg-emerald-600" />
              <span className="absolute -right-1 -top-1.5 h-3 w-px bg-emerald-600" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white/95 px-2.5 py-0.5 rounded-full border border-emerald-300 -mt-2.5 shadow-xs">
              TOLERANCE: {toleranceLabel}
            </span>
          </div>

          <div className="absolute top-1/3 bottom-1/3 right-8 flex items-center">
            <div className="h-full w-px bg-emerald-600/40 relative flex items-center">
              <span className="absolute -top-1 -left-1.5 w-3 h-px bg-emerald-600" />
              <span className="absolute -bottom-1 -left-1.5 w-3 h-px bg-emerald-600" />
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-white/95 px-2 py-0.5 rounded-full border border-emerald-300 -rotate-90 -translate-x-6 whitespace-nowrap shadow-xs">
                BIOMEDICAL ALLOY
              </span>
            </div>
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 text-zinc-600 gap-3">
            <svg
              className="w-8 h-8 animate-spin text-emerald-700"
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
            <span className="text-xs font-mono font-bold text-zinc-800">Loading 3D CAD Mesh...</span>
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
          <color attach="background" args={["#f8fafc"]} />

          {/* Workstation Lighting Rig */}
          <ambientLight intensity={lightingPreset === "laser" ? 0.75 : lightingPreset === "studio" ? 1.05 : 0.85} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={lightingPreset === "laser" ? 2.0 : lightingPreset === "studio" ? 2.6 : 2.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* Calibrated emerald rim-light */}
          <directionalLight position={[-8, -6, -6]} intensity={0.7} color="#059669" />
          <pointLight
            position={[0, 4, 2]}
            intensity={lightingPreset === "laser" ? 2.0 : 1.2}
            color={lightingPreset === "laser" ? "#10b981" : lightingPreset === "studio" ? "#ffffff" : "#047857"}
          />

          {/* 3D Model Geometry with Keyboard Rotation Wrapper and Error Boundary */}
          <group rotation={[rotation.x, rotation.y, 0]}>
            <ModelErrorBoundary
              fallback={
                <PlaceholderGeometry
                  modelId={modelId}
                  autoRotate={isRotating}
                  wireframe={isWireframe}
                />
              }
            >
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
            </ModelErrorBoundary>
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

      {/* Tactile CAD Controls Bar (Liquid Glass Capsule HUD) */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto select-none">
        {/* Left Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 liquid-glass-pill p-1.5 rounded-full border border-zinc-200/90 shadow-xl bg-white/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              isRotating
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-zinc-700 hover:text-zinc-950 bg-white/70 hover:bg-white border border-zinc-200/70"
            }`}
          >
            Auto-Rotate: {isRotating ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setIsWireframe((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              isWireframe
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-zinc-700 hover:text-zinc-950 bg-white/70 hover:bg-white border border-zinc-200/70"
            }`}
          >
            Wireframe: {isWireframe ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setShowCalipers((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              showCalipers
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-zinc-700 hover:text-zinc-950 bg-white/70 hover:bg-white border border-zinc-200/70"
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
            className="px-3 py-1.5 rounded-full text-xs font-mono font-bold text-zinc-800 bg-white/70 hover:bg-white border border-zinc-200/70 transition-all capitalize cursor-pointer"
          >
            Light: {lightingPreset}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-full text-xs font-mono font-bold text-zinc-600 hover:text-zinc-950 bg-white/70 hover:bg-white border border-zinc-200/70 transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Right Hint */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-600 liquid-glass-pill px-4 py-2 rounded-full border border-zinc-200/90 shadow-sm bg-white/80 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Drag to Orbit · Scroll to Zoom · Arrows: ±15°</span>
        </div>
      </div>
    </div>
  );
}
