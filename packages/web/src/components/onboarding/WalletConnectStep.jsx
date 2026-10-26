"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useWallet } from "@/hooks/useWallet";
import { CHAIN_ID } from "shared/constants";

export default function WalletConnectStep({ onConnected, initialAddress = null }) {
  const shouldReduceMotion = useReducedMotion();
  const { connect, address, formattedAddress, isConnected, isConnecting, error: walletError } = useWallet();
  const [localError, setLocalError] = useState(null);

  const activeAddress = address || initialAddress;
  const error = localError || walletError;

  const handleConnect = async () => {
    setLocalError(null);
    try {
      const res = await connect();
      if (onConnected && res?.address) {
        onConnected(res.address);
      }
    } catch (err) {
      setLocalError(err.message || "Failed to connect wallet.");
    }
  };

  const handleProceed = () => {
    if (activeAddress && onConnected) {
      onConnected(activeAddress);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="p-8 bg-[#121212] border-[#262626] shadow-xl">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#161616] border border-[#262626] text-3xl">
              🔌
            </span>
          </div>
          <div>
            <Badge variant="accent" size="sm">
              Step 1 of 3 • Identity
            </Badge>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#ededed] font-display">
              Connect Machinist Wallet
            </h2>
            <p className="mt-1 text-sm text-[#a1a1aa] leading-relaxed">
              Connect your BridgeKey or MetaMask wallet on MST Testnet (Chain ID{" "}
              {CHAIN_ID}) to sign challenge proofs and receive EXPEN token rewards.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2.5"
          >
            <span className="text-base leading-none">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {isConnected || activeAddress ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#161616] border border-[#26d464]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#26d464] animate-pulse" />
                <div>
                  <div className="text-xs text-[#71717a] font-mono uppercase">
                    Connected Wallet
                  </div>
                  <div className="text-sm font-bold text-[#ededed] font-mono">
                    {formattedAddress || activeAddress}
                  </div>
                </div>
              </div>
              <Badge variant="accent" size="sm">
                MST Ready
              </Badge>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleProceed}
              className="w-full"
            >
              Proceed to Profile Setup →
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              isLoading={isConnecting}
              onClick={handleConnect}
              className="w-full relative overflow-hidden group shadow-lg shadow-[#26d464]/10"
            >
              <span>Connect with BridgeKey</span>
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#262626]" />
              <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-[#71717a]">
                Or EVM Fallback
              </span>
              <div className="flex-grow border-t border-[#262626]" />
            </div>

            <Button
              variant="secondary"
              size="md"
              isLoading={isConnecting}
              onClick={handleConnect}
              className="w-full text-xs"
            >
              Connect with MetaMask / Web3 Provider
            </Button>

            <p className="text-center text-[11px] text-[#71717a] pt-2">
              No private keys leave your device. Signatures verify ownership via EIP-191.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
