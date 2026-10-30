import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import BlueprintsPage, { BLUEPRINTS } from "../../app/blueprints/page.js";

describe("BlueprintsPage & Acoustic Sound Notes Unit Tests", () => {
  it("exports BLUEPRINTS array with 5 calibrated fixtures and GD&T specs", () => {
    expect(BLUEPRINTS.length).toBe(5);
    const ids = BLUEPRINTS.map((b) => b.id);
    expect(ids).toEqual(["BP-01", "BP-02", "BP-03", "BP-04", "BP-05"]);
  });

  it("defines acoustic sound notes with valid frequencies and waveforms for all blueprints", () => {
    for (const bp of BLUEPRINTS) {
      expect(bp.soundNote).toBeDefined();
      expect(typeof bp.soundNote.frequency).toBe("number");
      expect(bp.soundNote.frequency).toBeGreaterThan(0);
      expect(["sine", "triangle", "sawtooth", "square"]).toContain(bp.soundNote.waveform);
      expect(bp.soundNote.label).toBeDefined();
      expect(bp.soundNote.acousticDescription).toBeDefined();
    }
  });

  it("renders blueprints catalog with acoustic tone buttons and frequencies", () => {
    const html = renderToString(React.createElement(BlueprintsPage));

    // Headers & Navigation
    expect(html).toContain("Machinist CAD/CAM Blueprints &amp; Acoustic Sound Notes");
    expect(html).toContain("Hydraulic Quick-Change Vise Jaw System");
    expect(html).toContain("Modular Damped Boring Bar with Lead-Shot Chamber");

    // Sound Note UI elements
    expect(html).toContain("2,400 Hz Chatter Harmonic Scream");
    expect(html).toContain("Play Note");
    expect(html).toContain("440 Hz Vise Clamping Resonance");
  });
});
