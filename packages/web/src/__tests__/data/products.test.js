import { describe, it, expect } from "bun:test";
import {
  PRODUCTS,
  CATEGORIES,
  filterProducts,
  getProductById,
} from "../../data/products.js";

describe("Tooling Marketplace Catalog & Filter Logic Unit Tests", () => {
  describe("Product Seed Data Integrity", () => {
    it("contains exactly 10 machining and manufacturing products", () => {
      expect(PRODUCTS.length).toBe(10);
    });

    it("verifies all 10 products have all mandatory fields with valid types", () => {
      const requiredFields = [
        "id",
        "name",
        "description",
        "price",
        "category",
        "imageUrl",
        "specs",
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

    it("ensures products with 3D models specify a valid modelId", () => {
      const productsWith3D = PRODUCTS.filter((p) => p.has3DModel);
      expect(productsWith3D.length).toBeGreaterThanOrEqual(2);

      for (const p of productsWith3D) {
        expect(typeof p.modelId).toBe("string");
        expect(["lathe-body", "drill-bit"]).toContain(p.modelId);
      }
    });
  });

  describe("Category and Price Filtering Logic", () => {
    it("filters products by category correctly", () => {
      const cuttingTools = filterProducts(PRODUCTS, { category: "Cutting Tools" });
      expect(cuttingTools.length).toBeGreaterThan(0);
      for (const item of cuttingTools) {
        expect(item.category).toBe("Cutting Tools");
      }

      const measuringTools = filterProducts(PRODUCTS, {
        category: "Measuring Instruments",
      });
      expect(measuringTools.length).toBeGreaterThan(0);
      for (const item of measuringTools) {
        expect(item.category).toBe("Measuring Instruments");
      }

      const all = filterProducts(PRODUCTS, { category: "All" });
      expect(all.length).toBe(10);
    });

    it("filters products within minimum and maximum price boundaries", () => {
      const filtered = filterProducts(PRODUCTS, { minPrice: 50, maxPrice: 150 });
      expect(filtered.length).toBeGreaterThan(0);
      for (const item of filtered) {
        expect(item.price).toBeGreaterThanOrEqual(50);
        expect(item.price).toBeLessThanOrEqual(150);
      }
    });

    it("handles inverted price bounds gracefully", () => {
      // Inverted bounds: min=150, max=50 should be swapped internally
      const filtered = filterProducts(PRODUCTS, { minPrice: 150, maxPrice: 50 });
      expect(filtered.length).toBeGreaterThan(0);
      for (const item of filtered) {
        expect(item.price).toBeGreaterThanOrEqual(50);
        expect(item.price).toBeLessThanOrEqual(150);
      }
    });

    it("handles extreme or open-ended price bounds", () => {
      const allPrices = filterProducts(PRODUCTS, { minPrice: 0, maxPrice: Infinity });
      expect(allPrices.length).toBe(10);
    });
  });

  describe("Keyword Search & Security Sanitization", () => {
    it("finds products by partial keyword match across name and category", () => {
      const results = filterProducts(PRODUCTS, { search: "carbide" });
      expect(results.length).toBeGreaterThanOrEqual(2);
      for (const item of results) {
        const text = `${item.name} ${item.category} ${item.description}`.toLowerCase();
        expect(text).toContain("carbide");
      }
    });

    it("sanitizes HTML tags and SQL injection keywords safely", () => {
      const injectionQuery = "<script>alert(1)</script>' OR 1=1 -- carbide";
      const results = filterProducts(PRODUCTS, { search: injectionQuery });
      expect(results.length).toBeGreaterThanOrEqual(2);
      for (const item of results) {
        const text = `${item.name} ${item.category} ${item.description}`.toLowerCase();
        expect(text).toContain("carbide");
      }
    });

    it("returns empty array for non-matching criteria", () => {
      const nonExistent = filterProducts(PRODUCTS, {
        category: "Cutting Tools",
        minPrice: 5000,
      });
      expect(nonExistent).toEqual([]);
    });
  });

  describe("getProductById Lookup", () => {
    it("returns product for existing valid ID", () => {
      const item = getProductById("prod-001");
      expect(item).not.toBeNull();
      expect(item.id).toBe("prod-001");
      expect(item.name).toContain("CNC Indexable");
    });

    it("returns null for non-existent or invalid product IDs", () => {
      expect(getProductById("prod-999")).toBeNull();
      expect(getProductById("")).toBeNull();
      expect(getProductById(null)).toBeNull();
    });
  });
});
