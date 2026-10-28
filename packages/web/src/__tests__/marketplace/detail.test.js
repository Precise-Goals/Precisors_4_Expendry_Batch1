import { describe, it, expect } from "bun:test";
import ProductDetailPage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/marketplace/[id]/page";
import { PRODUCTS } from "@/data/products";
import React from "react";
import ReactDOMServer from "react-dom/server";

describe("Marketplace Product Detail Page [id]", () => {
  it("generateStaticParams returns all 10 product ids", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(PRODUCTS.length);
    expect(params[0]).toHaveProperty("id");
  });

  it("generateMetadata generates title and description for valid product", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "prod-001" }),
    });
    expect(metadata.title).toContain("CNC Indexable Carbide Turning Insert Set");
    expect(metadata.description).toBeDefined();
  });

  it("renders page with Awwwards luxury industrial styling and Metallurgical Matrix", async () => {
    const pageJsx = await ProductDetailPage({
      params: Promise.resolve({ id: "prod-001" }),
    });
    const html = ReactDOMServer.renderToStaticMarkup(pageJsx);

    // 1. Color and container checks
    expect(html).toContain("bg-[#0a0a0a]");
    expect(html).toContain("bg-[#121212]");
    expect(html).toContain("specular-card");
    expect(html).toContain("#26d464");
    expect(html).toContain("border-[#262626]");
    expect(html).toContain("text-[#ededed]");
    expect(html).toContain("text-[#a1a1aa]");
    expect(html).toContain("font-montserrat");
    expect(html).toContain("font-mono");

    // 2. 3D inspection icon check
    expect(html).toContain("Inspect in Interactive 3D Viewer");
    expect(html).toContain("text-[#26d464]");

    // 3. Metallurgical Matrix card checks
    expect(html).toContain("Metallurgical Matrix");
    expect(html).toContain("Substrate Chemistry");
    expect(html).toContain("WC-Co Sub-micron Grain (0.6 μm)");
    expect(html).toContain("Hardness");
    expect(html).toContain("1650 - 1800 HV30");
    expect(html).toContain("Thermal Barrier");
    expect(html).toContain("AlTiN Multilayer (Up to 900°C)");
    expect(html).toContain("Quality Standard");
    expect(html).toContain("ISO 2768-mK / DIN 69871");

    // 4. Zero raw emoji glyphs check
    const emojiRegex =
      /(\u00a9|\u00ae|[\u203c-\u2049]|[\u20e3-\u21aa]|[\u231a-\u27bf]|[\u2934-\u2b55]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
    expect(emojiRegex.test(html)).toBe(false);
  });
});
