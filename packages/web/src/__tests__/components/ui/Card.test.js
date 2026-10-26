import { describe, it, expect, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/Card.jsx";

describe("Card UI Primitive", () => {
  it("renders base card container with styling", () => {
    const html = renderToString(
      React.createElement(Card, null, React.createElement("p", null, "Card body"))
    );
    expect(html).toContain("rounded-xl");
    expect(html).toContain("bg-[#121212]");
    expect(html).toContain("border-[#262626]");
    expect(html).toContain("Card body");
  });

  it("renders compound components with proper semantic markup", () => {
    const html = renderToString(
      React.createElement(
        Card,
        null,
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "CNC Setup Guide"),
          React.createElement(CardDescription, null, "Spindle speed calibration")
        ),
        React.createElement(CardContent, null, "Detailed instruction text"),
        React.createElement(CardFooter, null, "Footer metadata")
      )
    );

    expect(html).toContain("<h3");
    expect(html).toContain("CNC Setup Guide");
    expect(html).toContain("Spindle speed calibration");
    expect(html).toContain("Detailed instruction text");
    expect(html).toContain("Footer metadata");
  });

  it("applies interactive button role and tabIndex when onClick is provided", () => {
    const html = renderToString(
      React.createElement(Card, { onClick: () => {} }, "Clickable Card")
    );
    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("cursor-pointer");
  });

  it("triggers onClick on keyboard Enter and Space activation", () => {
    const clickMock = mock(() => {});
    const element = Card.render(
      {
        children: "Interactive Card",
        onClick: clickMock,
      },
      null
    );

    let prevented = false;
    element.props.onKeyDown({
      key: "Enter",
      preventDefault: () => {
        prevented = true;
      },
    });

    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(prevented).toBe(true);

    element.props.onKeyDown({
      key: " ",
      preventDefault: () => {},
    });

    expect(clickMock).toHaveBeenCalledTimes(2);
  });
});
