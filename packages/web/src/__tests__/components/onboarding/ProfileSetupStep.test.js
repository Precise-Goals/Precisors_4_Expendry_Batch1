import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileSetupStep, {
  EVALUATION_PRESETS,
} from "../../../components/onboarding/ProfileSetupStep.jsx";

describe("ProfileSetupStep Component & Quick Presets", () => {
  it("exports EVALUATION_PRESETS with exactly 2 presets", () => {
    expect(Array.isArray(EVALUATION_PRESETS)).toBe(true);
    expect(EVALUATION_PRESETS.length).toBe(2);
  });

  it("defines Preset 1 correctly for Rameshwar Kulkarni", () => {
    const preset1 = EVALUATION_PRESETS[0];
    expect(preset1.label).toBe(
      "Rameshwar Kulkarni (Aerospace Turning Specialist • Pune)"
    );
    expect(preset1.data.username).toBe("rameshwar-k");
    expect(preset1.data.email).toBe("rameshwar@kulkarni-aerospace.in");
    expect(preset1.data.phone).toBe("+91 98230 11452");
    expect(preset1.data.designation).toBe("Chief CNC Turning Specialist (34 Yrs)");
    expect(preset1.data.company).toBe("Kulkarni Aerospace Components Ltd.");
  });

  it("defines Preset 2 correctly for Devendra Patil", () => {
    const preset2 = EVALUATION_PRESETS[1];
    expect(preset2.label).toBe(
      "Devendra Patil (Tool & Die Master • Kolhapur)"
    );
    expect(preset2.data.username).toBe("devendra-patil");
    expect(preset2.data.email).toBe("devendra@patil-tooling.in");
    expect(preset2.data.phone).toBe("+91 94220 55198");
    expect(preset2.data.designation).toBe("Master Tool & Die Maker (29 Yrs)");
    expect(preset2.data.company).toBe("Patil Precision Forging & Dies");
  });

  it("renders the Quick Presets bar and preset chips", () => {
    const html = renderToString(
      React.createElement(ProfileSetupStep, {
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      })
    );

    expect(html).toContain("Quick Presets for Live Evaluation &amp; Judging");
    expect(html).toContain(
      "Rameshwar Kulkarni (Aerospace Turning Specialist • Pune)"
    );
    expect(html).toContain(
      "Devendra Patil (Tool &amp; Die Master • Kolhapur)"
    );
    expect(html).toContain("Preset 1");
    expect(html).toContain("Preset 2");
  });

  it("renders all profile input fields and actions", () => {
    const html = renderToString(
      React.createElement(ProfileSetupStep, {
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      })
    );

    expect(html).toContain('name="username"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="designation"');
    expect(html).toContain('name="company"');
    expect(html).toContain("Complete Registration &amp; Sign In");
    expect(html).toContain("Back");
  });

  it("contains zero emojis across presets and component labels", () => {
    const emojiRegex = /\p{Extended_Pictographic}/u;

    for (const preset of EVALUATION_PRESETS) {
      expect(emojiRegex.test(preset.label)).toBe(false);
      for (const val of Object.values(preset.data)) {
        expect(emojiRegex.test(val)).toBe(false);
      }
    }
  });
});
