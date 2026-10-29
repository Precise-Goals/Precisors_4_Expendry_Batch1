import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import AboutPage from "../../app/about/page.js";
import { CHAIN_ID, EXPLORER_URL } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

describe("AboutPage — Manifesto & Verified MSTScan Contract Component", () => {
  it("renders the hero manifesto and MST network identifier", () => {
    const html = renderToString(React.createElement(AboutPage));

    expect(html).toContain("Preserving the Tacit Soul of the Machine Shop");
    expect(html).toContain("Expendry Protocol Manifesto");
    expect(html).toContain("MST-");
    expect(html).toContain(String(CHAIN_ID));
  });

  it("renders the verified MSTScan token contract capsule with direct explorer link", () => {
    const html = renderToString(React.createElement(AboutPage));

    // Must contain contract address
    expect(html).toContain(EXPEN_ADDRESS);

    // Must contain direct link to explorer address
    expect(html).toContain(`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`);
    expect(html).toContain("MSTScan");
    expect(html).toContain("MST Testnet · Verified Contract");
  });

  it("renders the dual-engine technology stack and timeline", () => {
    const html = renderToString(React.createElement(AboutPage));

    expect(html).toContain("The Dual-Engine Technology Stack");
    expect(html).toContain("MST Blockchain &amp; EXPEN Tokenomics");
    expect(html).toContain("Sarvam AI Multilingual Grounding");
    expect(html).toContain("Four Decades of Toolroom Evolution");
  });
});
