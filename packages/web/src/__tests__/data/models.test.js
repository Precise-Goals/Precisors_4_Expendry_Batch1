import { describe, it, expect } from "bun:test";
import {
  MODELS,
  BIORAD_MODELS,
  getModelById,
  validateOrbitControlParams,
  generateFallbackGeometry,
} from "../../data/models.js";

describe("3D Showcase Models Registry", () => {
  it("exports exactly 9 Biorad Medisys clinical models in BIORAD_MODELS", () => {
    expect(BIORAD_MODELS.length).toBe(9);
    const bioradIds = BIORAD_MODELS.map((m) => m.id);
    expect(bioradIds).toEqual([
      "excel-mpk",
      "genius-cr",
      "genius-ps",
      "ouro-ps",
      "signature-stem",
      "signature-duo-cup",
      "signature-nx-cup",
      "dj-stent",
      "indoscope-sleek",
    ]);
  });

  it("contains all registered models including 9 real Biorad Medisys GLBs", () => {
    expect(MODELS.length).toBeGreaterThanOrEqual(9);
    const modelIds = MODELS.map((m) => m.id);
    expect(modelIds).toContain("excel-mpk");
    expect(modelIds).toContain("genius-cr");
    expect(modelIds).toContain("genius-ps");
    expect(modelIds).toContain("ouro-ps");
    expect(modelIds).toContain("signature-stem");
    expect(modelIds).toContain("signature-duo-cup");
    expect(modelIds).toContain("signature-nx-cup");
    expect(modelIds).toContain("dj-stent");
    expect(modelIds).toContain("indoscope-sleek");
  });

  it("verifies excel-mpk GLB model path and specifications", () => {
    const excel = getModelById("excel-mpk");
    expect(excel).toBeDefined();
    expect(excel.glbPath).toBe("/3d-models-products/EXCEL-MPK.glb");
    expect(excel.specs.material).toContain("CoCrMo Alloy");
    expect(excel.materials.metalness).toBe(0.95);
  });

  it("verifies signature-nx-cup GLB model path and materials", () => {
    const nxCup = getModelById("signature-nx-cup");
    expect(nxCup).toBeDefined();
    expect(nxCup.glbPath).toBe("/3d-models-products/Signature-NX-cup-with-ceramic-head.glb");
    expect(nxCup.specs.headMaterial).toContain("BIOLOX delta");
  });

  it("verifies end-mill specifications and materials", () => {
    const endMill = getModelById("end-mill");
    expect(endMill).toBeDefined();
    expect(endMill.name).toBe("4-Flute Solid Carbide Square End Mill");
    expect(endMill.geometryType).toBe("Helical Cylinder / 4 Flutes");
    expect(endMill.segments).toBe(48);
    expect(endMill.productId).toBe("prod-002");
    expect(endMill.materials.color).toBe("#1a202c");
    expect(endMill.materials.metalness).toBe(0.92);
    expect(endMill.materials.roughness).toBe(0.18);
    expect(endMill.specs.diameter).toBe("12.0 mm");
    expect(endMill.specs.flutes).toBe("4 Flutes");
    expect(endMill.specs.helixAngle).toBe("38°");
    expect(endMill.specs.coating).toBe("AlTiN Nano-composite");
    expect(endMill.specs.shankTolerance).toBe("h6 (±0.004mm)");
  });

  it("verifies face-mill specifications and materials", () => {
    const faceMill = getModelById("face-mill");
    expect(faceMill).toBeDefined();
    expect(faceMill.name).toBe("Indexable 45° Face Milling Shell Cutter");
    expect(faceMill.geometryType).toBe("Shell Mill Body / 4 Inserts");
    expect(faceMill.segments).toBe(64);
    expect(faceMill.productId).toBe("prod-004");
    expect(faceMill.materials.color).toBe("#2d3748");
    expect(faceMill.materials.metalness).toBe(0.88);
    expect(faceMill.materials.roughness).toBe(0.22);
    expect(faceMill.specs.cuttingDiameter).toBe("50.0 mm");
    expect(faceMill.specs.insertCount).toBe("4 Inserts (SEET 12T3)");
    expect(faceMill.specs.leadAngle).toBe("45°");
    expect(faceMill.specs.arborMount).toBe("FMA22 (ISO)");
    expect(faceMill.specs.bodyMaterial).toBe("42CrMo4 Alloy");
  });

  it("validates OrbitControls bounds for all models", () => {
    for (const model of MODELS) {
      expect(validateOrbitControlParams(model.orbitControls)).toBe(true);
    }
  });

  it("generates fallback geometry for unknown model id", () => {
    const fallback = generateFallbackGeometry("unknown-tool");
    expect(fallback.id).toBe("unknown-tool");
    expect(fallback.isFallback).toBe(true);
    expect(validateOrbitControlParams(fallback.orbitControls)).toBe(true);
  });
});
