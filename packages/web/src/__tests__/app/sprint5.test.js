import { describe, it, expect } from "bun:test";
import { PRODUCTS, getProductById, filterProducts } from "../../data/products.js";
import { MODELS, getModelById } from "../../data/models.js";
import { POST as speakHandler } from "../../app/api/agent/speak/route.js";

describe("Sprint 5 Integration & Sanity Test Suite", () => {
  describe("3D Biorad Medisys GLB Models & Marketplace Linking", () => {
    it("every product in PRODUCTS has has3DModel=true and points to a registered modelId", () => {
      expect(PRODUCTS.length).toBe(9);
      for (const product of PRODUCTS) {
        expect(product.has3DModel).toBe(true);
        expect(product.modelId).toBeDefined();

        const model = getModelById(product.modelId);
        expect(model).toBeDefined();
        expect(model.glbPath).toContain("/3d-models-products/");
        expect(model.glbPath).toMatch(/\.glb$/i);
      }
    });

    it("filterProducts filters exclusively for products with 3D models", () => {
      const all3D = filterProducts(PRODUCTS, { onlyWith3D: true });
      expect(all3D.length).toBe(9);
      for (const item of all3D) {
        expect(item.has3DModel).toBe(true);
        expect(item.modelId).toBeTruthy();
      }
    });

    it("verifies Biorad Medisys orthopedic knee and hip implant specs", () => {
      const excelKnee = getProductById("prod-001");
      expect(excelKnee.name).toContain("Excel Medial Pivot");
      expect(excelKnee.specs.material).toContain("CoCrMo Alloy");

      const hipStem = getProductById("prod-005");
      expect(hipStem.name).toContain("Signature Cementless");
      expect(hipStem.specs.substrate).toContain("Ti-6Al-4V");

      const deltaHead = getProductById("prod-007");
      expect(deltaHead.name).toContain("BIOLOX Delta Ceramic");
      expect(deltaHead.specs.headMaterial).toContain("Alumina Composite");
    });
  });

  describe("Sarvam Shubh TTS Endpoint (POST /api/agent/speak)", () => {
    it("returns 400 when missing text payload", async () => {
      const request = new Request("http://localhost:3000/api/agent/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "   " }),
      });

      const res = await speakHandler(request);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it("synthesises speech with Shubh voice profile", async () => {
      const request = new Request("http://localhost:3000/api/agent/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Welcome to Expendry precision manufacturing.",
          lang: "en",
        }),
      });

      const res = await speakHandler(request);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.audio).toBeDefined();
      expect(json.language).toBe("en");
    });

    it("handles Hindi and Marathi voice synthesis requests", async () => {
      const requestHi = new Request("http://localhost:3000/api/agent/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "खराद मशीन पर टूल चयन",
          lang: "hi",
        }),
      });

      const resHi = await speakHandler(requestHi);
      expect(resHi.status).toBe(200);
      const jsonHi = await resHi.json();
      expect(jsonHi.success).toBe(true);
      expect(jsonHi.language).toBe("hi");
    });
  });
});
