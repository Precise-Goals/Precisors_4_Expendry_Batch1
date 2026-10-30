import { describe, it, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import WalletConnectStep from "../../../components/onboarding/WalletConnectStep.jsx";

describe("WalletConnectStep Unit Tests", () => {
  it("renders connect button and bridgekey instructions", () => {
    const html = renderToString(React.createElement(WalletConnectStep, {}));
    expect(html).toContain("Connect BridgeKey Wallet");
    expect(html).toContain("bridgekey.io");
    expect(html).toContain("MST-Testnet #91562037");
    // Must NOT contain the old hardcoded fallback address
    expect(html).not.toContain("0x73595081334A18D4298A160b162faB4Fb4B3c85B");
  });

  it("renders connected state when initialAddress is provided", () => {
    const testAddr = "0x9876543210abcdef9876543210abcdef98765432";
    const html = renderToString(
      React.createElement(WalletConnectStep, { initialAddress: testAddr })
    );
    expect(html).toContain("BridgeKey Connected");
    expect(html).toContain(testAddr);
    expect(html).toContain("Complete Onboarding &amp; Claim 25 EXPEN");
  });
});
