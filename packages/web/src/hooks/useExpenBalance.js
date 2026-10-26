"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { CHAIN_ID, RPC_URL } from "shared/constants";
import { EXPEN_ADDRESS, EXPEN_ABI } from "shared/contracts";
import { isValidAddress } from "@/lib/wallet";

export function useExpenBalance(walletAddress) {
  const [balance, setBalance] = useState("0");
  const [rawBalance, setRawBalance] = useState(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress || !isValidAddress(walletAddress)) {
      setBalance("0");
      setRawBalance(0n);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL, {
        chainId: CHAIN_ID,
        name: "mst-testnet",
      });

      const contract = new ethers.Contract(EXPEN_ADDRESS, EXPEN_ABI, provider);
      const raw = await contract.balanceOf(walletAddress.toLowerCase());

      if (isMounted.current) {
        const formatted = ethers.formatUnits(raw, 18);
        setRawBalance(raw);
        // Clean trailing zeros
        const cleanBalance = parseFloat(formatted).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
        setBalance(cleanBalance);
      }
    } catch (err) {
      if (isMounted.current) {
        // Fallback for offline / demo mode
        setError(err.message || "Failed to fetch on-chain EXPEN balance.");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [walletAddress]);

  useEffect(() => {
    isMounted.current = true;
    queueMicrotask(() => {
      fetchBalance();
    });

    // Poll every 15 seconds as specified in commit plan
    const interval = setInterval(() => {
      fetchBalance();
    }, 15000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchBalance]);

  const formatted = `${balance} EXPEN`;

  return {
    balance,
    rawBalance,
    formatted,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}

export default useExpenBalance;
