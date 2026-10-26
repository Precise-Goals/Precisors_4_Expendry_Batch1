import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { useFocusTrap } from "../../hooks/useFocusTrap";

function TestTrapComponent({ isActive = true, onEscape = null }) {
  const ref = React.useRef(null);
  useFocusTrap(ref, isActive, onEscape);
  return React.createElement("div", { ref }, "test");
}

describe("useFocusTrap Hook Unit Tests", () => {
  it("exports useFocusTrap function", () => {
    expect(typeof useFocusTrap).toBe("function");
  });

  it("renders inside a React component without crashing", () => {
    expect(() => {
      renderToString(React.createElement(TestTrapComponent));
    }).not.toThrow();
  });

  it("handles inactive trap state cleanly", () => {
    expect(() => {
      renderToString(React.createElement(TestTrapComponent, { isActive: false }));
    }).not.toThrow();
  });
});
