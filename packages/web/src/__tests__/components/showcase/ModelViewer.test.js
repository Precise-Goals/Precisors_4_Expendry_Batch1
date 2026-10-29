import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";

// Mock Three.js canvas components for headless test environments
mock.module("three", () => ({}));
mock.module("@react-three/fiber", () => ({
  Canvas: ({ children, className }) => React.createElement("div", { className, "data-testid": "three-canvas" }, children),
  useFrame: () => {},
}));

mock.module("@react-three/drei", () => ({
  OrbitControls: () => React.createElement("div", { "data-testid": "orbit-controls" }),
  useGLTF: () => ({ scene: null }),
  Center: ({ children }) => React.createElement("div", null, children),
}));

import ModelViewer, { ModelErrorBoundary, initDracoLoader } from "../../../components/showcase/ModelViewer.jsx";

describe("ModelViewer — 3D CAD Workstation Component", () => {
  it("renders CAD workstation telemetry and viewport region with accessible labels", () => {
    const html = renderToString(React.createElement(ModelViewer, { modelId: "excel-mpk" }));

    expect(html).toContain('aria-roledescription="3D model viewer"');
    expect(html).toContain("CAD-3D:");
    expect(html).toContain("60 FPS");
    expect(html).toContain("PBR:");
  });

  it("renders interactive tactile liquid-glass controls with state labels", () => {
    const html = renderToString(React.createElement(ModelViewer, { modelId: "excel-mpk" }));

    expect(html).toContain("Auto-Rotate:");
    expect(html).toContain("Wireframe:");
    expect(html).toContain("Calipers:");
    expect(html).toContain("Light:");
    expect(html).toContain("Reset");
  });

  it("renders dimensional caliper dynamic HUD overlay with tolerance metrics", () => {
    const html = renderToString(React.createElement(ModelViewer, { modelId: "excel-mpk" }));

    expect(html).toContain("TOLERANCE:");
    expect(html).toContain("BIOMEDICAL ALLOY");
    expect(html).toContain("[DATUM A]");
  });

  it("ModelErrorBoundary catches errors via getDerivedStateFromError and renders fallback", () => {
    const state = ModelErrorBoundary.getDerivedStateFromError(new Error("GLTFLoader texture decoding failure"));
    expect(state.hasError).toBe(true);

    const boundary = new ModelErrorBoundary({
      fallback: React.createElement("div", { "data-testid": "fallback-mesh" }, "Fallback CAD Mesh"),
    });
    boundary.state = { hasError: true };
    const rendered = boundary.render();
    expect(rendered.props["data-testid"]).toBe("fallback-mesh");
    expect(rendered.props.children).toBe("Fallback CAD Mesh");
  });

  it("initDracoLoader exports valid configuration and CDN decoder path", () => {
    const config = initDracoLoader();
    expect(config.isConfigured).toBe(true);
    expect(config.decoderPath).toContain("gstatic.com/draco");
    expect(config.preload()).toBe(true);
  });
});
