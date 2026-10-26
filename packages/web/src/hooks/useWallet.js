"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProvider,
  connectWallet,
  switchToMST,
  formatAddress,
  isValidAddress,
} from "@/lib/wallet";
import { CHAIN_ID } from "shared/constants";

const STORAGE_KEYS = {
  ADDRESS: "expendry_wallet_address",
  CHAIN_ID: "expendry_wallet_chain",
  PROVIDER_TYPE: "expendry_provider_type",
};

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [providerType, setProviderType] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedAddress = sessionStorage.getItem(STORAGE_KEYS.ADDRESS);
      const savedChain = sessionStorage.getItem(STORAGE_KEYS.CHAIN_ID);
      const savedType = sessionStorage.getItem(STORAGE_KEYS.PROVIDER_TYPE);

      if (savedAddress && isValidAddress(savedAddress)) {
        queueMicrotask(() => {
          setAddress(savedAddress.toLowerCase());
          setChainId(savedChain || `0x${CHAIN_ID.toString(16)}`);
          setProviderType(savedType || "bridgekey");
          setIsConnected(true);
        });
      }
    } catch {
      // sessionStorage may fail in private browsing modes
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setProviderType(null);
    setIsConnected(false);
    setError(null);

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.ADDRESS);
        sessionStorage.removeItem(STORAGE_KEYS.CHAIN_ID);
        sessionStorage.removeItem(STORAGE_KEYS.PROVIDER_TYPE);
      } catch {
        // ignore
      }
    }
  }, []);

  // Set up provider event listeners
  useEffect(() => {
    const provider = getProvider();
    if (!provider || !provider.on) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnect();
      } else {
        const newAddress = accounts[0].toLowerCase();
        setAddress(newAddress);
        setIsConnected(true);
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADDRESS, newAddress);
        } catch {
          // ignore
        }
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
      try {
        sessionStorage.setItem(STORAGE_KEYS.CHAIN_ID, newChainId);
      } catch {
        // ignore
      }
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [disconnect]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await connectWallet();
      setAddress(result.address);
      setChainId(result.chainId);
      setProviderType(result.providerType);
      setIsConnected(true);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(STORAGE_KEYS.ADDRESS, result.address);
          sessionStorage.setItem(STORAGE_KEYS.CHAIN_ID, result.chainId);
          sessionStorage.setItem(STORAGE_KEYS.PROVIDER_TYPE, result.providerType);
        } catch {
          // ignore
        }
      }

      return result;
    } catch (err) {
      const msg = err.message || "Failed to connect wallet";
      setError(msg);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    try {
      await switchToMST();
      setChainId(`0x${CHAIN_ID.toString(16)}`);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const formattedAddress = address ? formatAddress(address) : null;

  return {
    address,
    formattedAddress,
    chainId,
    providerType,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    switchToMST: switchNetwork,
  };
}

export default useWallet;
