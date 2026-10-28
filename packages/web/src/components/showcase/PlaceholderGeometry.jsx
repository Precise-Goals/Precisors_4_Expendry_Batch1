"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getModelById, generateFallbackGeometry } from "@/data/models";

export function LatheToolGeometry({
  metalness = 0.85,
  roughness = 0.25,
  color = "#4a5568",
  wireframe = false,
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
          wireframe={wireframe}
        />
      </mesh>

      {/* Chamfered front insert seat */}
      <mesh position={[0, 0.1, 1.65]} rotation={[-0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 1.0, 0.8]} />
        <meshStandardMaterial
          color="#1a202c"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* TiN Golden Indexable Turning Insert (CNMG 432) */}
      <mesh position={[0.4, 0.65, 1.85]} rotation={[0, 0.785, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.18, 4]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.12}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top clamping screw and wedge mechanism */}
      <mesh position={[0.2, 0.7, 1.4]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
        <meshStandardMaterial
          color="#718096"
          metalness={0.8}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function DrillBitGeometry({
  metalness = 0.9,
  roughness = 0.18,
  color = "#1a202c",
  wireframe = false,
}) {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Precision ground cylindrical drill shank */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.8, 24]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.85}
          roughness={0.22}
          wireframe={wireframe}
        />
      </mesh>

      {/* AlTiN dark coated fluted cutting body */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.6, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
        />
      </mesh>

      {/* Helical spiral flutes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} position={[0, 0.8, 0]} rotation={[0.3, angle, 0.3]}>
          <cylinderGeometry args={[0.57, 0.57, 1.5, 6]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.1}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 140-degree self-centering split-point cone */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.55, 0.45, 24]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

export function EndMillGeometry({
  metalness = 0.92,
  roughness = 0.18,
  color = "#1a202c",
  wireframe = false,
}) {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Precision ground cylindrical shank (h6 tolerance) */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.88}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* AlTiN coated solid carbide cutting body */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.4, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
        />
      </mesh>

      {/* 4 helical spiral cutting edges (38° helix angle) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={`flute-${idx}`} position={[0, 0.7, 0]} rotation={[0.38, angle, 0.2]}>
          <cylinderGeometry args={[0.58, 0.58, 1.4, 6]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.12}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* Flat end face cutting geometry */}
      <mesh position={[0, 1.41, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.95}
          roughness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Flat face end-cutting relief teeth */}
      {[0, Math.PI / 2].map((angle, idx) => (
        <mesh key={`relief-${idx}`} position={[0, 1.43, 0]} rotation={[0, angle, 0]}>
          <boxGeometry args={[1.08, 0.02, 0.1]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FaceMillGeometry({
  metalness = 0.88,
  roughness = 0.22,
  color = "#2d3748",
  wireframe = false,
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* Heavy-duty alloy steel disc shell mill body (42CrMo4) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.55, 0.85, 48]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
        />
      </mesh>

      {/* Central arbor bore (FMA22 / ISO mount) */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.9, 32]} />
        <meshStandardMaterial
          color="#0c0d12"
          metalness={0.95}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>

      {/* Arbor mounting flange & drive keyway slots */}
      {[0, Math.PI / 2].map((angle, idx) => (
        <mesh key={`keyway-${idx}`} position={[0, 0.35, 0]} rotation={[0, angle, 0]}>
          <boxGeometry args={[0.22, 0.25, 1.35]} />
          <meshStandardMaterial
            color="#171923"
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 4 Indexable Insert Pockets at 45° Lead Angle */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const radius = 1.32;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <group key={`pocket-${idx}`} position={[x, -0.1, z]} rotation={[0.4, angle, 0]}>
            {/* Precision machined pocket seat */}
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.4, 0.3]} />
              <meshStandardMaterial
                color="#1a202c"
                metalness={0.9}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>

            {/* SEET 12T3 45° Indexable Milling Insert (TiN Coated Gold) */}
            <mesh position={[0, 0, 0.1]} rotation={[0, 0, 0.785]} castShadow>
              <boxGeometry args={[0.34, 0.34, 0.12]} />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.95}
                roughness={0.14}
                wireframe={wireframe}
              />
            </mesh>

            {/* Torx central clamping screw */}
            <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
              <meshStandardMaterial
                color="#718096"
                metalness={0.85}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function PlaceholderGeometry({
  modelId = "lathe-body",
  autoRotate = true,
  wireframe = false,
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
  const isEndMill = model.id === "end-mill";
  const isFaceMill = model.id === "face-mill";

  return (
    <group ref={groupRef}>
      {isLathe ? (
        <LatheToolGeometry {...model.materials} wireframe={wireframe} />
      ) : isDrill ? (
        <DrillBitGeometry {...model.materials} wireframe={wireframe} />
      ) : isEndMill ? (
        <EndMillGeometry {...model.materials} wireframe={wireframe} />
      ) : isFaceMill ? (
        <FaceMillGeometry {...model.materials} wireframe={wireframe} />
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial
            color={model.materials?.color || "#26d464"}
            metalness={model.materials?.metalness ?? 0.5}
            roughness={model.materials?.roughness ?? 0.5}
            wireframe={wireframe}
          />
        </mesh>
      )}
    </group>
  );
}
