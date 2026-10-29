"use client";

import React, { useRef, useMemo, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D Cascading Token & Precision Octagonal Nut Stage
 * Inspired by luxury industrial fintech aesthetics (Nickel reference)
 * Features an 8-sided chamfered titanium nut with warm orange rim reflection
 * and silver EXPEN tokens cascading downward with realistic physics & specular sheen.
 */

function Coin({ position, rotation, scale = 1, index = 0 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle organic floating motion
    meshRef.current.position.y = position[1] + Math.sin(t * 1.8 + index * 1.2) * 0.06;
    meshRef.current.rotation.z = rotation[2] + Math.cos(t * 1.2 + index * 0.9) * 0.04;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Outer Coin Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.12, 48]} />
        <meshStandardMaterial
          color="#e8ecf2"
          metalness={0.96}
          roughness={0.16}
        />
      </mesh>

      {/* Raised Outer Rim */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.045, 16, 48]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.98}
          roughness={0.12}
        />
      </mesh>

      {/* Embossed EXPEN 'E' Token Emblem Front */}
      <group position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Vertical Spine Bar */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.12, 0.8, 0.03]} />
          <meshStandardMaterial
            color="#26d464"
            emissive="#26d464"
            emissiveIntensity={0.25}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Top Arm */}
        <mesh position={[0.02, 0.34, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.03]} />
          <meshStandardMaterial
            color="#26d464"
            emissive="#26d464"
            emissiveIntensity={0.25}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Mid Arm */}
        <mesh position={[-0.03, 0, 0]}>
          <boxGeometry args={[0.24, 0.1, 0.03]} />
          <meshStandardMaterial
            color="#26d464"
            emissive="#26d464"
            emissiveIntensity={0.25}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Bottom Arm */}
        <mesh position={[0.02, -0.34, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.03]} />
          <meshStandardMaterial
            color="#26d464"
            emissive="#26d464"
            emissiveIntensity={0.25}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}

function OctagonalNut() {
  const nutRef = useRef();

  useFrame((state) => {
    if (!nutRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle idling breathing
    nutRef.current.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.03;
  });

  return (
    <group ref={nutRef} position={[0.2, -1.8, 0]} rotation={[0.42, -0.3, 0]}>
      {/* Main 8-sided Chamfered Nut Outer Shell */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 1.8, 8]} />
        <meshStandardMaterial
          color="#dbe3ec"
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Top Beveled Face (Faceted) */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[2.9, 3.2, 0.1, 8]} />
        <meshStandardMaterial
          color="#edf2f7"
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>

      {/* Copper/Orange Beveled Rim Accent Line (matching reference warm glow) */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[2.7, 2.75, 0.04, 8]} />
        <meshStandardMaterial
          color="#ff7a29"
          emissive="#ff5500"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Central Milled Cavity Chamber */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.65, 1.45, 1.4, 24]} />
        <meshStandardMaterial
          color="#1e242c"
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>

      {/* Cavity Inner Floor */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.42, 1.42, 0.08, 24]} />
        <meshStandardMaterial
          color="#0f1318"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Internal Milled Thread Ridges */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[1.58, 0.04, 12, 32]} />
        <meshStandardMaterial
          color="#ff8833"
          emissive="#ff6611"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Studio Key Lights */}
      <ambientLight intensity={0.7} color="#cbd5e1" />

      {/* Overhead Pure White Key Lighting */}
      <directionalLight
        position={[3, 8, 6]}
        intensity={2.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Warm Orange Rim Specular Light from lower right, recreating the reference glow */}
      <directionalLight
        position={[5, -1, 3]}
        intensity={3.8}
        color="#ff6b1a"
      />

      {/* Cool Soft Fill from top-left */}
      <directionalLight
        position={[-6, 4, 3]}
        intensity={1.2}
        color="#93c5fd"
      />

      {/* Specular Point Highlight over the cascading coins */}
      <pointLight position={[1, 3.5, 2.5]} intensity={2.0} color="#ffffff" distance={8} />

      {/* 3D Meshes */}
      <group position={[-0.2, 0, 0]}>
        {/* The Precision Machine Nut Base */}
        <OctagonalNut />

        {/* The Cascading Sequence of 4 Silver Coins tumbling into the slot */}
        {/* Coin 1: Bottom coin tilted, entering the slot */}
        <Coin
          position={[0.3, -0.65, 0.45]}
          rotation={[0.75, 0.25, -0.65]}
          scale={0.76}
          index={0}
        />

        {/* Coin 2: Mid-low coin facing camera at 30° angle */}
        <Coin
          position={[0.55, 0.95, 0.25]}
          rotation={[0.35, 0.38, 0.12]}
          scale={0.84}
          index={1}
        />

        {/* Coin 3: Mid-high coin tilted back */}
        <Coin
          position={[0.78, 2.65, -0.05]}
          rotation={[0.52, -0.25, 0.38]}
          scale={0.9}
          index={2}
        />

        {/* Coin 4: Top coin entering from high perspective */}
        <Coin
          position={[1.05, 4.35, -0.35]}
          rotation={[0.22, 0.18, -0.12]}
          scale={0.94}
          index={3}
        />
      </group>

      {/* Interactive Orbit Control with gentle constraint */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.06}
        rotateSpeed={0.65}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minPolarAngle={Math.PI / 3}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
    </>
  );
}

const subscribe = () => () => {};

export default function HeroTokenStage() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[480px] lg:min-h-[620px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-orange-500/40 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[660px] select-none">
      {/* Background Radial Studio Lighting Reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-radial-[circle_at_65%_45%] from-white/10 via-transparent to-transparent opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 bg-orange-500/15 blur-[120px] rounded-full"
      />

      <Canvas
        camera={{ position: [-0.6, 1.8, 8.4], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Scene />
      </Canvas>

      {/* Subtle Interactive Instruction Pill */}
      <div className="absolute bottom-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] font-mono text-zinc-300 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <span>Drag to rotate 3D hardware · 60 FPS</span>
      </div>
    </div>
  );
}
