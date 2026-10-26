import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { Button } from "../../../components/ui/Button.jsx";

describe("Button UI Primitive", () => {
  it("renders children and default primary variant", () => {
    const html = renderToString(React.createElement(Button, null, "Connect Wallet"));
    expect(html).toContain("Connect Wallet");
    expect(html).toContain("bg-[#26d464]");
    expect(html).toContain("text-black");
    expect(html).toContain('type="button"');
  });

  it("renders secondary and ghost variants correctly", () => {
    const secondaryHtml = renderToString(
      React.createElement(Button, { variant: "secondary" }, "Cancel")
    );
    expect(secondaryHtml).toContain("bg-[#161616]");
    expect(secondaryHtml).toContain("border-[#262626]");

    const ghostHtml = renderToString(
      React.createElement(Button, { variant: "ghost" }, "Details")
    );
    expect(ghostHtml).toContain("bg-transparent");
  });

  it("handles disabled state with correct aria attributes", () => {
    const disabledHtml = renderToString(
      React.createElement(Button, { disabled: true }, "Submitting")
    );
    expect(disabledHtml).toContain("disabled");
    expect(disabledHtml).toContain('aria-disabled="true"');
    expect(disabledHtml).toContain("disabled:opacity-50");
  });

  it("renders spinner when isLoading is true", () => {
    const loadingHtml = renderToString(
      React.createElement(Button, { isLoading: true }, "Minting")
    );
    expect(loadingHtml).toContain("animate-spin");
    expect(loadingHtml).toContain('aria-disabled="true"');
  });

  it("passes through custom className and handles keyboard Enter activation", () => {
    const clickMock = mock(() => {});
    const element = Button.render(
      {
        children: "Action",
        className: "custom-test-btn",
        onClick: clickMock,
      },
      null
    );

    expect(element.props.className).toContain("custom-test-btn");

    // Simulate Enter keydown
    let prevented = false;
    element.props.onKeyDown({
      key: "Enter",
      preventDefault: () => {
        prevented = true;
      },
    });

    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(prevented).toBe(true);
  });

  it("does not trigger onClick on keyboard Enter when disabled", () => {
    const clickMock = mock(() => {});
    const element = Button.render(
      {
        children: "Action",
        disabled: true,
        onClick: clickMock,
      },
      null
    );

    element.props.onKeyDown({
      key: "Enter",
      preventDefault: () => {},
    });

    expect(clickMock).toHaveBeenCalledTimes(0);
  });
});
