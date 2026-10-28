import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  LatheToolGeometry,
  DrillBitGeometry,
  EndMillGeometry,
  FaceMillGeometry,
} from "../../../components/showcase/PlaceholderGeometry.jsx";

describe("CAD Tooling Geometries Rendering", () => {
  it("renders LatheToolGeometry without errors", () => {
    const html = renderToString(React.createElement(LatheToolGeometry));
    expect(html).toBeDefined();
  });

  it("renders DrillBitGeometry without errors", () => {
    const html = renderToString(React.createElement(DrillBitGeometry));
    expect(html).toBeDefined();
  });

  it("renders EndMillGeometry with custom material props", () => {
    const html = renderToString(
      React.createElement(EndMillGeometry, {
        metalness: 0.92,
        roughness: 0.18,
        color: "#1a202c",
        wireframe: false,
      })
    );
    expect(html).toBeDefined();
  });

  it("renders FaceMillGeometry with custom material props", () => {
    const html = renderToString(
      React.createElement(FaceMillGeometry, {
        metalness: 0.88,
        roughness: 0.22,
        color: "#2d3748",
        wireframe: false,
      })
    );
    expect(html).toBeDefined();
  });
});
