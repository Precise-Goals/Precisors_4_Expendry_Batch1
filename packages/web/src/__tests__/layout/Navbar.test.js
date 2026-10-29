import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";

mock.module("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
  }),
}));

import Navbar, { NAV_LINKS } from "../../components/layout/Navbar.jsx";
import { EXPEN_ADDRESS } from "shared/contracts";

describe("Navbar — Clean Liquid Glass Floating Capsule Component", () => {
  it("renders the floating detached capsule with liquid-glass-pill styling", () => {
    const html = renderToString(React.createElement(Navbar));

    // Must be floating capsule fixed near top
    expect(html).toContain("fixed top-3");
    expect(html).toContain("liquid-glass-pill");
    expect(html).toContain("max-w-5xl");
    expect(html).toContain("rounded-full");
  });

  it("renders all 9 defined navigation links with proper hrefs", () => {
    const html = renderToString(React.createElement(Navbar));

    for (const link of NAV_LINKS) {
      expect(html).toContain(`href="${link.href}"`);
      expect(html).toContain(link.label);
    }
  });

  it("renders the brand logo with spindle icon and EXPEND RY wordmark", () => {
    const html = renderToString(React.createElement(Navbar));

    expect(html).toContain("EXPEND");
    expect(html).toContain("RY");
    expect(html).toContain('href="/"');
  });

  it("renders strictly the Sign In CTA button and does NOT display the MST contract capsule in the navbar", () => {
    const html = renderToString(React.createElement(Navbar));

    // Sign In button must be present
    expect(html).toContain('href="/login"');
    expect(html).toContain("Sign In");

    // MST contract capsule must NOT be present in Navbar (relocated to /about section)
    expect(html).not.toContain(EXPEN_ADDRESS);
    expect(html).not.toContain("View EXPEN Token Contract on MSTScan Explorer");
  });
});
