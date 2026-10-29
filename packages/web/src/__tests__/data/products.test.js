import { describe, it, expect } from "bun:test";
import {
  PRODUCTS,
  CATEGORIES,
  filterProducts,
  getProductById,
} from "../../data/products.js";

describe("Tooling & Medical Implants Marketplace Catalog & Filter Logic", () => {
  describe("Product Seed Data Integrity", () => {
    it("contains exactly 9 precision implant products with 3D models", () => {
      expect(PRODUCTS.length).toBe(9);
    });

    it("verifies all 9 products have all mandatory fields with valid types", () => {
      const requiredFields = [
        "id",
        "name",
        "description",
        "price",
        "category",
        "imageUrl",
        "specs",
        "has3DModel",
        "modelId",
      ];

      for (const product of PRODUCTS) {
        for (const field of requiredFields) {
          expect(product[field]).toBeDefined();
        }

        expect(product.id).toMatch(/^prod-\d{3}$/);
        expect(typeof product.name).toBe("string");
        expect(product.name.length).toBeGreaterThan(5);
        expect(typeof product.description).toBe("string");
        expect(product.description.length).toBeGreaterThan(15);
        expect(typeof product.price).toBe("number");
        expect(product.price).toBeGreaterThan(0);
        expect(typeof product.category).toBe("string");
        expect(CATEGORIES).toContain(product.category);
        expect(typeof product.specs).toBe("object");
        expect(Object.keys(product.specs).length).toBeGreaterThanOrEqual(2);
      }
    });

    it("ensures 100% of marketplace products have active 3D models linked", () => {
      for (const p of PRODUCTS) {
        expect(p.has3DModel).toBe(true);
        expect(typeof p.modelId).toBe("string");
        expect([
          "excel-mpk",
          "genius-cr",
          "genius-ps",
          "ouro-ps",
          "signature-stem",
          "signature-duo-cup",
          "signature-nx-cup",
          "dj-stent",
          "indoscope-sleek",
        ]).toContain(p.modelId);
      }
    });
  });

  describe("Category and Price Filtering Logic", () => {
    it("filters products by category correctly", () => {
      const knees = filterProducts(PRODUCTS, { category: "Orthopedic Knees" });
      expect(knees.length).toBe(4);
      for (const item of knees) {
        expect(item.category).toBe("Orthopedic Knees");
      }

      const hips = filterProducts(PRODUCTS, { category: "Hip Arthroplasty" });
      expect(hips.length).toBe(3);
      for (const item of hips) {
        expect(item.category).toBe("Hip Arthroplasty");
      }

      const urology = filterProducts(PRODUCTS, {
        category: "Endosurgical & Urology",
      });
      expect(urology.length).toBe(2);
      for (const item of urology) {
        expect(item.category).toBe("Endosurgical & Urology");
      }

      const all = filterProducts(PRODUCTS, { category: "All" });
      expect(all.length).toBe(9);
    });

    it("filters products within minimum and maximum price boundaries", () => {
      const filtered = filterProducts(PRODUCTS, { minPrice: 700, maxPrice: 900 });
      expect(filtered.length).toBeGreaterThan(0);
      for (const item of filtered) {
        expect(item.price).toBeGreaterThanOrEqual(700);
        expect(item.price).toBeLessThanOrEqual(900);
      }
    });

    it("handles inverted price bounds gracefully", () => {
      const filtered = filterProducts(PRODUCTS, { minPrice: 900, maxPrice: 700 });
      expect(filtered.length).toBeGreaterThan(0);
      for (const item of filtered) {
        expect(item.price).toBeGreaterThanOrEqual(700);
        expect(item.price).toBeLessThanOrEqual(900);
      }
    });

    it("handles extreme or open-ended price bounds", () => {
      const allPrices = filterProducts(PRODUCTS, { minPrice: 0, maxPrice: Infinity });
      expect(allPrices.length).toBe(9);
    });
  });

  describe("Search & Product Retrieval", () => {
    it("retrieves product by valid ID", () => {
      const prod = getProductById("prod-001");
      expect(prod).toBeDefined();
      expect(prod.name).toContain("Excel Medial Pivot");
      expect(prod.modelId).toBe("excel-mpk");
    });

    it("returns null for non-existent or invalid ID", () => {
      expect(getProductById("prod-999")).toBeNull();
      expect(getProductById(null)).toBeNull();
      expect(getProductById("")).toBeNull();
    });

    it("performs keyword search matching product name, category, or description", () => {
      const results = filterProducts(PRODUCTS, { search: "pivot" });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe("prod-001");
    });
  });
});
