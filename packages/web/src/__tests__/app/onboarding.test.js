import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";

mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
  }),
}));

mock.module("../../hooks/useWallet", () => ({
  useWallet: () => ({
    connect: async () => ({ address: "0x1234567890abcdef1234567890abcdef12345678" }),
    address: null,
    formattedAddress: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  }),
}));

import OnboardingPage, {
  WORST_CASE_DATA,
} from "../../app/onboarding/page.js";

describe("OnboardingPage — Clean Discord-Style Flow & Stress Resistance", () => {
  it("exports WORST_CASE_DATA for adversarial stress testing", () => {
    expect(WORST_CASE_DATA).toBeDefined();
    expect(WORST_CASE_DATA.name).toBe("Christopher Alexander Montgomery III");
    expect(WORST_CASE_DATA.email).toBe(
      "bartholomew.fitzgerald@northwind-industries-holdings.example.com"
    );
    expect(WORST_CASE_DATA.phone).toBe("+91 98230 11452");
    expect(WORST_CASE_DATA.designation.length).toBeGreaterThan(50);
    expect(WORST_CASE_DATA.company.length).toBeGreaterThan(50);
  });

  it("renders Stage 1 without any dummy presets or slop buttons", () => {
    const html = renderToString(React.createElement(OnboardingPage));

    // Must NOT contain any legacy/demo presets
    expect(html).not.toContain("Quick Preset (Demo &amp; Testing)");
    expect(html).not.toContain("Quick Preset (Demo & Testing)");
    expect(html).not.toContain("Rameshwar Kulkarni (Aerospace Specialist)");
    expect(html).not.toContain("Devendra Patil (Tool &amp; Die Master)");

    // Must render Stage 1 clean headings
    expect(html).toContain("Welcome to Expendry");
    expect(html).toContain("Let&#x27;s personalize your workspace");

    // Must render bounded inputs with maxLength limits
    expect(html).toContain('name="name"');
    expect(html).toContain('maxLength="80"');
    expect(html).toContain('name="designation"');
    expect(html).toContain('maxLength="100"');
    expect(html).toContain('name="company"');
    expect(html).toContain('maxLength="100"');

    // Must have Continue CTA
    expect(html).toContain("Continue");
  });

  it("contains character counters to prevent unbounded text overflow", () => {
    const html = renderToString(React.createElement(OnboardingPage));
    expect(html).toContain("/80");
    expect(html).toContain("/100");
  });
});
