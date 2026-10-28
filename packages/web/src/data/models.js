/**
 * 3D Tooling Showcase Model Registry
 *
 * Defines procedural and GLB asset specifications for CNC machining tools.
 * Configures physical PBR metallic/roughness parameters, camera bounds,
 * and OrbitControls parameters.
 */

export const MODELS = [
  {
    id: "lathe-body",
    name: "Precision CNC Lathe Turning Tool Assembly",
    shortName: "CNC Lathe Tool",
    description:
      "Square-shank CNC indexable lathe toolholder with negative-rake CNMG insert and rigid wedge-clamp geometry.",
    geometryType: "LatheGeometry",
    segments: 32,
    verticesCount: 1024,
    materials: {
      metalness: 0.85,
      roughness: 0.25,
      color: "#4a5568",
    },
    orbitControls: {
      minDistance: 2.0,
      maxDistance: 15.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      shankSize: "25mm x 25mm",
      insertFit: "CNMG 432",
      clamping: "Rigid Top Clamp & Shim",
      overallLength: "150mm",
      application: "Heavy roughing & facing operations",
    },
    productId: "prod-001",
    glbPath: "/models/lathe-tool.glb",
  },
  {
    id: "drill-bit",
    name: "High-Helix AlTiN Solid Carbide Drill Geometry",
    shortName: "Carbide Drill Bit",
    description:
      "High-helix parabolic flute solid carbide drill with 140° self-centering point geometry and dual helical coolant passages.",
    geometryType: "CylinderAndConeGeometry",
    segments: 48,
    verticesCount: 1536,
    materials: {
      metalness: 0.9,
      roughness: 0.18,
      color: "#1a202c",
    },
    orbitControls: {
      minDistance: 1.5,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      pointAngle: "140° Split Point",
      helixAngle: "30° High Helix",
      coating: "AlTiN Multilayer PVD",
      coolantHoles: "Dual Helical Internal Ports",
      application: "Deep hole drilling in alloy steels & titanium",
    },
    productId: "prod-002",
    glbPath: "/models/drill-bit.glb",
  },
  {
    id: "end-mill",
    name: "4-Flute Solid Carbide Square End Mill",
    shortName: "Carbide End Mill",
    description:
      "High-performance solid carbide square end mill with 38° helix angle and AlTiN nano-composite coating for precision slotting and peripheral milling.",
    geometryType: "Helical Cylinder / 4 Flutes",
    segments: 48,
    verticesCount: 2048,
    materials: {
      color: "#1a202c",
      metalness: 0.92,
      roughness: 0.18,
    },
    orbitControls: {
      minDistance: 1.5,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      diameter: "12.0 mm",
      flutes: "4 Flutes",
      helixAngle: "38°",
      coating: "AlTiN Nano-composite",
      shankTolerance: "h6 (±0.004mm)",
    },
    productId: "prod-002",
    glbPath: "/models/end-mill.glb",
  },
  {
    id: "face-mill",
    name: "Indexable 45° Face Milling Shell Cutter",
    shortName: "45° Face Mill",
    description:
      "Indexable 45-degree face milling shell cutter body with 4 SEET 12T3 insert pockets, through-tool coolant capability, and FMA22 arbor interface.",
    geometryType: "Shell Mill Body / 4 Inserts",
    segments: 64,
    verticesCount: 2560,
    materials: {
      color: "#2d3748",
      metalness: 0.88,
      roughness: 0.22,
    },
    orbitControls: {
      minDistance: 2.0,
      maxDistance: 15.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      cuttingDiameter: "50.0 mm",
      insertCount: "4 Inserts (SEET 12T3)",
      leadAngle: "45°",
      arborMount: "FMA22 (ISO)",
      bodyMaterial: "42CrMo4 Alloy",
    },
    productId: "prod-004",
    glbPath: "/models/face-mill.glb",
  },
];

/**
 * Returns model specification by ID or null.
 */
export function getModelById(id) {
  if (!id || typeof id !== "string") return null;
  return MODELS.find((m) => m.id === id) || null;
}

/**
 * Validates OrbitControls parameters for camera safety boundaries.
 */
export function validateOrbitControlParams(controls) {
  if (!controls || typeof controls !== "object") return false;
  if (typeof controls.minDistance !== "number" || controls.minDistance <= 0) {
    return false;
  }
  if (
    typeof controls.maxDistance !== "number" ||
    controls.maxDistance <= controls.minDistance
  ) {
    return false;
  }
  if (
    typeof controls.maxPolarAngle !== "number" ||
    controls.maxPolarAngle > Math.PI
  ) {
    return false;
  }
  return true;
}

/**
 * Generates procedural fallback geometry descriptor for unknown model IDs.
 */
export function generateFallbackGeometry(id = "procedural-placeholder") {
  return {
    id,
    name: "Procedural Fallback Tool Geometry",
    geometryType: "BoxGeometry",
    isFallback: true,
    materials: {
      metalness: 0.5,
      roughness: 0.5,
      color: "#26d464",
    },
    orbitControls: {
      minDistance: 1.0,
      maxDistance: 20.0,
      maxPolarAngle: Math.PI,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      type: "Procedural Fallback",
      status: "Placeholder Mesh",
    },
    productId: "prod-001",
    glbPath: null,
  };
}
