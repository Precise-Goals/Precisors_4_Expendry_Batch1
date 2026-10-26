"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getModelById, generateFallbackGeometry } from "@/data/models";

export function LatheToolGeometry({
  metalness = 0.85,
  roughness = 0.25,
  color = "#4a5568",
}) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Heavy-duty alloy steel rectangular tool shank */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 3.2]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {/* Chamfered front insert seat */}
      <mesh position={[0, 0.1, 1.65]} rotation={[-0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 1.0, 0.8]} />
        <meshStandardMaterial
          color="#1a202c"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* TiN Golden Indexable Turning Insert (CNMG 432) */}
      <mesh position={[0.4, 0.65, 1.85]} rotation={[0, 0.785, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.18, 4]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* Top clamping screw and wedge mechanism */}
      <mesh position={[0.2, 0.7, 1.4]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
        <meshStandardMaterial
          color="#718096"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export function DrillBitGeometry({
  metalness = 0.9,
  roughness = 0.18,
  color = "#1a202c",
}) {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Precision ground cylindrical drill shank */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      {/* AlTiN dark coated fluted cutting body */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.6, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {/* Helical spiral flutes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} position={[0, 0.8, 0]} rotation={[0.3, angle, 0.3]}>
          <cylinderGeometry args={[0.57, 0.57, 1.5, 8]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* 140-degree self-centering split-point cone */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.55, 0.45, 32]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

export default function PlaceholderGeometry({
  modelId = "lathe-body",
  autoRotate = true,
}) {
  const groupRef = useRef(null);
  const model = getModelById(modelId) || generateFallbackGeometry(modelId);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const isLathe = model.id === "lathe-body";
  const isDrill = model.id === "drill-bit";

  return (
    <group ref={groupRef}>
      {isLathe ? (
        <LatheToolGeometry {...model.materials} />
      ) : isDrill ? (
        <DrillBitGeometry {...model.materials} />
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color={model.materials?.color || "#26d464"}
            metalness={model.materials?.metalness ?? 0.5}
            roughness={model.materials?.roughness ?? 0.5}
          />
        </mesh>
      )}
    </group>
  );
}
