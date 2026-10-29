import { describe, it, expect } from "bun:test";
import ProductDetailPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/marketplace/[id]/page";
import { PRODUCTS } from "@/data/products";
import React from "react";
import ReactDOMServer from "react-dom/server";

describe("Marketplace Product Detail Page [id]", () => {
  it("generateStaticParams returns all 9 precision implant product ids", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(PRODUCTS.length);
    expect(params[0]).toHaveProperty("id");
  });

  it("generateMetadata generates title and description for valid product", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "prod-001" }),
    });
    expect(metadata.title).toContain("Excel Medial Pivot");
    expect(metadata.description).toBeDefined();
  });

  it("renders page with Awwwards luxury industrial styling and Metallurgical Matrix", async () => {
    const pageJsx = await ProductDetailPage({
      params: Promise.resolve({ id: "prod-001" }),
    });
    const html = ReactDOMServer.renderToStaticMarkup(pageJsx);

    // 1. Color and container checks (White/Green/Black high-contrast theme)
    expect(html).toContain("bg-white");
    expect(html).toContain("text-zinc-900");
    expect(html).toContain("telemetry-chip");
    expect(html).toContain("font-montserrat");
    expect(html).toContain("font-mono");

    // 2. 3D inspection icon check
    expect(html).toContain("Inspect in Interactive 3D Viewer");
    expect(html).toContain("text-emerald-700");

    // 3. Metallurgical Matrix card checks
    expect(html).toContain("Metallurgical Matrix");
    expect(html).toContain("Substrate Chemistry");
    expect(html).toContain("CoCrMo Cast Alloy (ASTM F75)");
    expect(html).toContain("Hardness");
  });
});
