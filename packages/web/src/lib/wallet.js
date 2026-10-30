import { CHAIN_ID, NETWORK_CONFIG } from "shared/constants";

/**
 * Detects the injected Web3 provider, prioritizing BridgeKey over window.ethereum
 */
export function getProvider() {
  if (typeof window === "undefined") return null;

  // 1. Direct BridgeKey extension injection
  if (window.bridgekey) return window.bridgekey;

  // 2. Check for multi-injected wallet providers (EIP-5749 / window.ethereum.providers)
  if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
    const bridgekeyProvider = window.ethereum.providers.find(
      (p) => p.isBridgeKey || p.name?.toLowerCase().includes("bridgekey")
    );
    if (bridgekeyProvider) return bridgekeyProvider;
    return window.ethereum.providers[0];
  }

  // 3. Standard injected window.ethereum (MetaMask or BridgeKey acting as default)
  if (window.ethereum) return window.ethereum;

  return null;
}

/**
 * Validates an Ethereum address (must be valid 40-hex-char format and non-zero)
 */
export function isValidAddress(address) {
  if (typeof address !== "string") return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
  if (address.toLowerCase() === "0x0000000000000000000000000000000000000000") return false;
  return true;
}

/**
 * Formats a checksummed/raw address to truncated standard: 0x1234...5678 (13 characters)
 */
export function formatAddress(address) {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  const clean = address.toLowerCase();
  return `${clean.slice(0, 6)}...${clean.slice(-4)}`;
}

/**
 * Connects to the injected wallet and verifies/switches to MST Testnet
 */
export async function connectWallet() {
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "No Web3 provider found. Please install BridgeKey or MetaMask to continue."
    );
  }

  const providerType = window.bridgekey ? "bridgekey" : "ethereum";

  try {
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts authorized by wallet.");
    }

    const address = accounts[0].toLowerCase();

    // Check current chain ID
    let chainIdHex = await provider.request({ method: "eth_chainId" });

    const targetChainIdHex = `0x${CHAIN_ID.toString(16)}`;

    if (chainIdHex.toLowerCase() !== targetChainIdHex.toLowerCase()) {
      await switchToMST(provider);
      chainIdHex = targetChainIdHex;
    }

    return {
      address,
      chainId: chainIdHex,
      providerType,
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("Wallet connection was rejected by the user.");
    }
    throw error;
  }
}

/**
 * Requests switching the wallet chain to MST Testnet (Chain ID 91562037)
 */
export async function switchToMST(provider = getProvider()) {
  if (!provider) {
    throw new Error("No Web3 provider found.");
  }

  const targetChainIdHex = `0x${CHAIN_ID.toString(16)}`;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainIdHex }],
    });
  } catch (switchError) {
    // Error code 4902 indicates that the chain has not been added to the wallet
    if (switchError.code === 4902 || switchError.message?.includes("Unrecognized chain")) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_CONFIG],
        });
      } catch (addError) {
        if (addError.code === 4001) {
          throw new Error("Chain addition was rejected by the user.");
        }
        throw new Error(`Failed to add MST Testnet to wallet: ${addError.message}`);
      }
    } else if (switchError.code === 4001) {
      throw new Error("Chain switch was rejected by the user.");
    } else {
      throw new Error(`Failed to switch chain to MST Testnet: ${switchError.message}`);
    }
  }
}
