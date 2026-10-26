"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { getModelById, generateFallbackGeometry } from "@/data/models";

function ProceduralToolMesh({ modelId, autoRotate = true }) {
  const meshGroupRef = useRef(null);
  const model = getModelById(modelId) || generateFallbackGeometry(modelId);

  useFrame((_, delta) => {
    if (autoRotate && meshGroupRef.current) {
      meshGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  const isLathe = model.id === "lathe-body";
  const isDrill = model.id === "drill-bit";

  return (
    <group ref={meshGroupRef}>
      {isLathe ? (
        // CNC Lathe Turning Tool Assembly
        <group position={[0, -0.2, 0]}>
          {/* Main rectangular steel toolholder shank */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.2, 3.2]} />
            <meshStandardMaterial
              color="#2d3748"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>

          {/* Chamfered front head holding insert */}
          <mesh position={[0, 0.1, 1.65]} rotation={[-0.2, 0.3, 0]} castShadow>
            <boxGeometry args={[1.1, 1.0, 0.8]} />
            <meshStandardMaterial
              color="#1a202c"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Golden TiN coated indexable diamond insert (CNMG 432) */}
          <mesh position={[0.4, 0.65, 1.85]} rotation={[0, 0.785, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.18, 4]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.12}
            />
          </mesh>

          {/* Top clamping screw / wedge */}
          <mesh position={[0.2, 0.7, 1.4]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
            <meshStandardMaterial
              color="#718096"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ) : isDrill ? (
        // High-Helix AlTiN Solid Carbide Drill Bit
        <group position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
          {/* Smooth cylindrical shank */}
          <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />
            <meshStandardMaterial
              color="#4a5568"
              metalness={0.85}
              roughness={0.22}
            />
          </mesh>

          {/* Fluted cutting body */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 1.6, 32]} />
            <meshStandardMaterial
              color="#1a202c"
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>

          {/* Helical spiral ribs indicating flute geometry */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh
              key={idx}
              position={[0, 0.8, 0]}
              rotation={[0.3, angle, 0.3]}
            >
              <cylinderGeometry args={[0.57, 0.57, 1.5, 8]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.95}
                roughness={0.1}
                wireframe={false}
              />
            </mesh>
          ))}

          {/* 140-degree conical drill chisel point */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.55, 0.45, 32]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
        </group>
      ) : (
        // Fallback procedural geometry
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color="#26d464"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      )}
    </group>
  );
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
          <ProceduralToolMesh modelId={modelId} autoRotate={autoRotate} />

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
