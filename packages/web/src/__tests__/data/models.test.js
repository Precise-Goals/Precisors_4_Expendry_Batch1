import { describe, it, expect } from "bun:test";
import {
  MODELS,
  getModelById,
  validateOrbitControlParams,
  generateFallbackGeometry,
} from "../../data/models.js";

describe("3D Tooling Showcase Models Registry", () => {
  it("contains all 4 tooling models", () => {
    expect(MODELS.length).toBe(4);
    const modelIds = MODELS.map((m) => m.id);
    expect(modelIds).toEqual(["lathe-body", "drill-bit", "end-mill", "face-mill"]);
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
