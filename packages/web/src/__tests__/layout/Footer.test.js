import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import Footer from "../../components/layout/Footer.jsx";
import { EXPLORER_URL, CHAIN_ID } from "shared/constants";
import { EXPEN_ADDRESS } from "shared/contracts";

describe("Footer — Floating Island White Component", () => {
  it("renders the floating island card with rounded-4xl, white base, and solid border", () => {
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain("rounded-4xl");
    expect(html).toContain("bg-white");
    expect(html).toContain("border-zinc-200");
  });

  it("renders the monumental expendry wordmark with background-clip gradient", () => {
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain("bg-clip-text");
    expect(html).toContain("text-transparent");
    expect(html).toContain("bg-gradient-to-r");
    expect(html).toContain("expendry");
    expect(html).toContain("®");
  });

  it("renders verified MSTScan deployed EXPEN token contract link", () => {
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain(`${EXPLORER_URL}/address/${EXPEN_ADDRESS}`);
    expect(html).toContain("EXPEN Contract (MSTScan)");
  });

  it("renders all 4 navigation columns (PLATFORM, ENGINEERING, ECOSYSTEM & LEGAL, SHOP-FLOOR)", () => {
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain("PLATFORM");
    expect(html).toContain("ENGINEERING");
    expect(html).toContain("ECOSYSTEM &amp; LEGAL");
    expect(html).toContain("SHOP-FLOOR");
    expect(html).toContain("Biorad Medisys Pune");
    expect(html).toContain("BridgeKey Wallet");
  });

  it("renders the tactile back to top pill button", () => {
    const html = renderToString(React.createElement(Footer));

    expect(html).toContain("Back to top");
    expect(html).toContain("rounded-full");
    expect(html).toContain("MST-Testnet");
    expect(html).toContain(String(CHAIN_ID));
  });
});
