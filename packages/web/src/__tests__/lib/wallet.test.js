import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  getProvider,
  isValidAddress,
  formatAddress,
  connectWallet,
  switchToMST,
} from "../../lib/wallet.js";
import { CHAIN_ID } from "shared/constants";

describe("Wallet Utilities & Detection Logic", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    globalThis.window = {};
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  describe("Provider Detection Hierarchy", () => {
    it("prefers window.bridgekey when both BridgeKey and window.ethereum exist", () => {
      const mockBridgeKey = { isBridgeKey: true };
      const mockEthereum = { isMetaMask: true };

      window.bridgekey = mockBridgeKey;
      window.ethereum = mockEthereum;

      const provider = getProvider();
      expect(provider).toBe(mockBridgeKey);
    });

    it("falls back to window.ethereum when BridgeKey is not installed", () => {
      const mockEthereum = { isMetaMask: true };
      window.ethereum = mockEthereum;

      const provider = getProvider();
      expect(provider).toBe(mockEthereum);
    });

    it("returns null when no provider is injected", () => {
      const provider = getProvider();
      expect(provider).toBeNull();
    });
  });

  describe("Address Validation and Formatting", () => {
    it("validates valid checksummed and lowercase Ethereum addresses", () => {
      expect(isValidAddress("0x73595081334A18D4298A160b162faB4Fb4B3c85B")).toBe(true);
      expect(isValidAddress("0x73595081334a18d4298a160b162fab4fb4b3c85b")).toBe(true);
    });

    it("rejects zero address, non-hex strings, and incorrect lengths", () => {
      expect(isValidAddress("0x0000000000000000000000000000000000000000")).toBe(false);
      expect(isValidAddress("0x1234")).toBe(false);
      expect(isValidAddress("not-an-address")).toBe(false);
      expect(isValidAddress(null)).toBe(false);
    });

    it("formats address to 13-character truncated representation: 0x1234...5678", () => {
      const formatted = formatAddress("0x73595081334A18D4298A160b162faB4Fb4B3c85B");
      expect(formatted).toBe("0x7359...c85b");
      expect(formatted.length).toBe(13);
    });

    it("throws an error when attempting to format an invalid address", () => {
      expect(() => formatAddress("invalid")).toThrow(/Invalid Ethereum address/);
    });
  });

  describe("connectWallet and Chain Switch Orchestration", () => {
    it("successfully connects wallet and returns normalized address on MST chain", async () => {
      const targetChainHex = `0x${CHAIN_ID.toString(16)}`;
      window.bridgekey = {
        request: async ({ method }) => {
          if (method === "eth_requestAccounts") {
            return ["0x73595081334A18D4298A160b162faB4Fb4B3c85B"];
          }
          if (method === "eth_chainId") {
            return targetChainHex;
          }
          throw new Error(`Unhandled method: ${method}`);
        },
      };

      const result = await connectWallet();
      expect(result.address).toBe("0x73595081334a18d4298a160b162fab4fb4b3c85b");
      expect(result.chainId).toBe(targetChainHex);
      expect(result.providerType).toBe("bridgekey");
    });

    it("triggers chain switch if connected to a non-MST chain", async () => {
      const targetChainHex = `0x${CHAIN_ID.toString(16)}`;
      let switched = false;

      window.ethereum = {
        request: async ({ method, params }) => {
          if (method === "eth_requestAccounts") {
            return ["0x7FC1d02922d4865fd53De59697407a42e64d1Cad"];
          }
          if (method === "eth_chainId") {
            return "0x1"; // Ethereum Mainnet
          }
          if (method === "wallet_switchEthereumChain") {
            expect(params[0].chainId).toBe(targetChainHex);
            switched = true;
            return null;
          }
          throw new Error(`Unhandled method: ${method}`);
        },
      };

      const result = await connectWallet();
      expect(switched).toBe(true);
      expect(result.providerType).toBe("ethereum");
    });

    it("handles 4902 error by calling wallet_addEthereumChain", async () => {
      let addedChain = false;
      const targetChainHex = `0x${CHAIN_ID.toString(16)}`;

      const provider = {
        request: async ({ method, params }) => {
          if (method === "wallet_switchEthereumChain") {
            const err = new Error("Unrecognized chain");
            err.code = 4902;
            throw err;
          }
          if (method === "wallet_addEthereumChain") {
            expect(params[0].chainId).toBe(targetChainHex);
            addedChain = true;
            return null;
          }
          throw new Error(`Unhandled method: ${method}`);
        },
      };

      await switchToMST(provider);
      expect(addedChain).toBe(true);
    });

    it("gracefully catches user rejection error code 4001", async () => {
      window.ethereum = {
        request: async ({ method }) => {
          if (method === "eth_requestAccounts") {
            const err = new Error("User rejected request");
            err.code = 4001;
            throw err;
          }
        },
      };

      expect(connectWallet()).rejects.toThrow(/rejected by the user/);
    });

    it("throws descriptive error when no Web3 provider is present", async () => {
      expect(connectWallet()).rejects.toThrow(/No Web3 provider found/);
    });
  });
});
