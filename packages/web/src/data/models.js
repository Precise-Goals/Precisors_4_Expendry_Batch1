/**
 * 3D Showcase Model Registry
 *
 * Defines GLB asset specifications for high-precision Biorad Medisys
 * orthopedic implants, surgical tools, and CNC tooling.
 * Configures physical PBR metallic/roughness parameters, camera bounds,
 * and OrbitControls safety envelopes.
 */

export const MODELS = [
  // --- Biorad Medisys Orthopedic & Endosurgical Implants (Real GLB Assets) ---
  {
    id: "excel-mpk",
    name: "Excel Medial Pivot Knee (MPK) System",
    shortName: "Excel MPK Knee",
    description:
      "Precision-machined CoCrMo femoral knee component featuring medial pivot kinematics for anatomical stability and deep flexion wear reduction.",
    geometryType: "Precision Cast & 5-Axis CNC CoCrMo Alloy",
    segments: 128,
    verticesCount: 14820,
    materials: {
      metalness: 0.95,
      roughness: 0.12,
      color: "#e2e8f0",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      material: "CoCrMo Alloy (ISO 5832-4)",
      kinematics: "Medial Pivot Asymmetric",
      surfaceFinish: "Mirror Electropolished Ra < 0.02 µm",
      femoralSize: "Size 3 Left/Right Anatomical",
      millingTolerance: "±0.005 mm profile error",
    },
    productId: "prod-001",
    glbPath: "/3d-models-products/EXCEL-MPK.glb",
  },
  {
    id: "genius-cr",
    name: "Genius Cruciate Retaining (CR) Knee System",
    shortName: "Genius CR Knee",
    description:
      "Cruciate-retaining total knee arthroplasty femoral prosthesis engineered with bone-conserving geometry and physiologic femoral roll-back.",
    geometryType: "5-Axis High-Speed Machined CoCrMo",
    segments: 128,
    verticesCount: 13950,
    materials: {
      metalness: 0.94,
      roughness: 0.14,
      color: "#cbd5e1",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      material: "Medical Grade CoCrMo",
      stability: "Cruciate Retaining (PCL Retained)",
      bearingInterface: "Ultra-High Molecular Weight PE",
      radiusOfCurvature: "Proportional J-Curve",
      tolerance: "ISO 7207-2 Compliant",
    },
    productId: "prod-002",
    glbPath: "/3d-models-products/GENIUS-CR.glb",
  },
  {
    id: "genius-ps",
    name: "Genius Posterior Stabilized (PS) Knee System",
    shortName: "Genius PS Knee",
    description:
      "Posterior stabilized knee arthroplasty femoral component equipped with high-efficiency cam-and-post mechanism for 145° deep flexion.",
    geometryType: "5-Axis Multi-Flute CNC Milled",
    segments: 128,
    verticesCount: 14210,
    materials: {
      metalness: 0.95,
      roughness: 0.13,
      color: "#e2e8f0",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      material: "CoCrMo Alloy (Cast & CNC Finish)",
      camGeometry: "Rounded Anti-Jump Spine Contact",
      flexionAngle: "Up to 145° Flexion",
      patellarGroove: "Deep Anatomical Sulcus",
      inspection: "Coordinate Measuring Machine (CMM) Certified",
    },
    productId: "prod-003",
    glbPath: "/3d-models-products/GENIUS-PS.glb",
  },
  {
    id: "ouro-ps",
    name: "Ouro Posterior Stabilized High-Flexion Knee",
    shortName: "Ouro PS Knee",
    description:
      "Ergonomically contoured Asian-fit femoral knee component tailored for high lifestyle flexion activities including kneeling and squatting.",
    geometryType: "Multi-Axis CNC Machined Biomaterial",
    segments: 128,
    verticesCount: 13680,
    materials: {
      metalness: 0.96,
      roughness: 0.11,
      color: "#f1f5f9",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      material: "Forged CoCrMo ASTM F75",
      specialization: "High Flexion Lifestyle Adaptation",
      trochleaAngle: "7° Lateralized Groove",
      posteriorFlange: "Reduced Thickness for Bone Preservation",
      certification: "CE Marked & CDSCO Approved",
    },
    productId: "prod-004",
    glbPath: "/3d-models-products/OURO-PS.glb",
  },
  {
    id: "signature-stem",
    name: "Signature Cementless Porous Titanium Hip Stem",
    shortName: "Signature Hip Stem",
    description:
      "Taper-wedge femoral stem manufactured from Ti-6Al-4V ELI with proximal plasma-sprayed titanium and hydroxyapatite dual coating for rapid osseointegration.",
    geometryType: "CNC Mill-Turn Forged Titanium Alloy",
    segments: 96,
    verticesCount: 9840,
    materials: {
      metalness: 0.88,
      roughness: 0.28,
      color: "#94a3b8",
    },
    orbitControls: {
      minDistance: 1.0,
      maxDistance: 15.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      substrate: "Ti-6Al-4V ELI (ASTM F136)",
      coating: "Porous Ti Mesh + Hydroxyapatite (HA)",
      taper: "12/14 Eurotaper Spindle",
      neckShaftAngle: "135° Standard & 127° Extended Offset",
      surfaceRoughness: "Ra 50-70 µm in porous zone",
    },
    productId: "prod-005",
    glbPath: "/3d-models-products/Signature-Stem.glb",
  },
  {
    id: "signature-duo-cup",
    name: "Signature Duo Dual-Mobility Acetabular Cup",
    shortName: "Signature Duo Cup",
    description:
      "Dual mobility acetabular cup designed to prevent hip dislocation in high-demand active patients through dual articulation biomechanics.",
    geometryType: "Spherical Turn-Mill Precision Alloy",
    segments: 96,
    verticesCount: 11400,
    materials: {
      metalness: 0.92,
      roughness: 0.16,
      color: "#cbd5e1",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 10.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      shellMaterial: "Stainless Steel / CoCrMo Dual Coating",
      innerBore: "Mirror Finish Ra < 0.015 µm",
      fixation: "Press-fit Equatorial Macro-Grooves",
      outerDiameters: "44mm to 62mm in 2mm increments",
      articulation: "Mobile UHMWPE insert bearing",
    },
    productId: "prod-006",
    glbPath: "/3d-models-products/Signature-Duo-Cup-1.glb",
  },
  {
    id: "signature-nx-cup",
    name: "Signature NX Cup with Delta Ceramic Femoral Head",
    shortName: "NX Cup & Ceramic Head",
    description:
      "State-of-the-art hard-on-hard hip articulation pairing BIOLOX Delta alumina-zirconia ceramic head with press-fit Signature NX acetabular shell.",
    geometryType: "Ultra-Precision Ceramic-Metal Assembly",
    segments: 144,
    verticesCount: 38200,
    materials: {
      metalness: 0.93,
      roughness: 0.08,
      color: "#f8fafc",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      headMaterial: "BIOLOX delta Alumina Composite Ceramic",
      cupMaterial: "Titanium Porous Plasma Shell",
      headDiameters: "28mm, 32mm, 36mm, 40mm",
      taperFitting: "12/14 High-Precision Female Morse Cone",
      wearRate: "< 0.5 mm³ / million cycles",
    },
    productId: "prod-007",
    glbPath: "/3d-models-products/Signature-NX-cup-with-ceramic-head.glb",
  },
  {
    id: "dj-stent",
    name: "Hydrophilic Double-J Ureteral Stent Assembly",
    shortName: "DJ Ureteral Stent",
    description:
      "Extruded biocompatible polyurethane ureteral drainage stent with coiled pigtail anchors and lubricious hydrophilic coating.",
    geometryType: "Helical Extruded Biopolymer Mesh",
    segments: 64,
    verticesCount: 8400,
    materials: {
      metalness: 0.2,
      roughness: 0.6,
      color: "#0284c7",
    },
    orbitControls: {
      minDistance: 0.5,
      maxDistance: 8.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      polymer: "Medical Grade Radiopaque Polyurethane",
      gauge: "4.5 Fr / 6.0 Fr / 7.0 Fr",
      length: "26 cm / 28 cm Dual Pigtail",
      drainage: "Multiple Side Drainage Eyes",
      radiopacity: "Barium Sulfate Blend for Fluoroscopy",
    },
    productId: "prod-008",
    glbPath: "/3d-models-products/DJ-Stent-Short-Term.glb",
  },
  {
    id: "indoscope-sleek",
    name: "Indoscope Sleek Semi-Rigid Endoscopy Instrument",
    shortName: "Indoscope Sleek",
    description:
      "Ultra-compact semi-rigid ureterorenoscope engineered with German fiber-optic bundles and laser-welded stainless steel instrument channel.",
    geometryType: "Laser-Welded Surgical Stainless Shaft",
    segments: 80,
    verticesCount: 16500,
    materials: {
      metalness: 0.9,
      roughness: 0.2,
      color: "#334155",
    },
    orbitControls: {
      minDistance: 0.8,
      maxDistance: 15.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05,
    },
    specs: {
      outerSheath: "Seamless 316L Stainless Steel",
      distalTip: "Tapered 6.5 Fr Atraumic Bevel",
      optics: "High-Resolution 50,000 Pixel Fiber Bundle",
      workingChannel: "3.4 Fr for Holmium Laser Fiber",
      angleView: "5° / 12° Offset Eyepiece",
    },
    productId: "prod-009",
    glbPath: "/3d-models-products/Indoscope-Sleek.glb",
  },

  // --- Machining Tooling Models (Retained for Test & Reference Compatibility) ---
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
    glbPath: "/3d-models-products/EXCEL-MPK.glb",
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
    glbPath: "/3d-models-products/GENIUS-CR.glb",
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
    glbPath: "/3d-models-products/GENIUS-PS.glb",
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
    glbPath: "/3d-models-products/OURO-PS.glb",
  },
];

/**
 * Exactly 9 high-precision Biorad Medisys Pune orthopedic & endosurgical products
 */
export const BIORAD_MODELS = MODELS.slice(0, 9);

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
    name: "Procedural Precision Tool Geometry",
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
      type: "Procedural Mesh",
      status: "Placeholder Mesh",
    },
    productId: "prod-001",
    glbPath: null,
  };
}
