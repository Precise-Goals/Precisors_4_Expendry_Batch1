"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { IconToken, IconCheck, IconExternal } from "@/components/ui/Icons";
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
      setLocalError(
        err.message ||
          "BridgeKey wallet extension was not detected or the connection was rejected. Please ensure the BridgeKey browser extension is installed, enabled, and unlocked."
      );
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
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="p-8 bg-white border-zinc-200 shadow-xl rounded-3xl">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-emerald-400 shadow-md">
              <IconToken className="w-8 h-8 text-emerald-400" />
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Final Step • BridgeKey Web3
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
              Connect BridgeKey Wallet
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
              Connect your BridgeKey wallet on MST Testnet (Chain ID {CHAIN_ID}) to sign cryptographic
              reputation proofs and claim your 25 EXPEN machinist onboarding allocation.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-2.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
            <div className="pl-6">
              <a
                href="https://bridgekey.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-bold shadow-xs transition"
              >
                <span>Install BridgeKey Extension</span>
                <IconExternal className="w-3 h-3 text-white" />
              </a>
            </div>
          </div>
        )}

        {isConnected || activeAddress ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                  ✓
                </span>
                <div>
                  <div className="text-xs font-mono font-bold text-zinc-900">
                    BridgeKey Connected
                  </div>
                  <div className="text-xs font-mono text-zinc-600">
                    {formattedAddress || activeAddress}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                MST-91562037
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold font-montserrat transition shadow-md active:scale-95 cursor-pointer"
            >
              Complete Onboarding &amp; Claim 25 EXPEN →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold font-montserrat transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <IconToken className="w-4 h-4 text-emerald-400" />
              <span>{isConnecting ? "Connecting to BridgeKey..." : "Connect BridgeKey Wallet"}</span>
            </button>

            {/* Direct Link to BridgeKey.io */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-1.5">
              <span className="text-xs text-zinc-600 font-body block">
                Don&apos;t have a BridgeKey Web3 wallet yet?
              </span>
              <a
                href="https://bridgekey.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>Get BridgeKey Wallet at bridgekey.io</span>
                <IconExternal className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Gas · Free Onboarding</span>
          </span>
          <span>MST-Testnet #91562037</span>
        </div>
      </Card>
    </motion.div>
  );
}
