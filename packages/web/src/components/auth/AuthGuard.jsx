"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IconToken } from "@/components/ui/Icons";

export default function AuthGuard({
  children,
  fallback,
  title = "Wallet Authentication Required",
  description = "Connect your BridgeKey or MetaMask wallet to author machining posts, claim EXPEN on-chain rewards, and save your preferences.",
}) {
  const { isConnected, address, connect, isConnecting, error } = useWallet();

  // If wallet is connected with a valid address, render protected children
  if (isConnected && address) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="auth-guard-title"
      aria-describedby="auth-guard-desc"
      className="w-full my-6 p-6 rounded-2xl bg-[#121212] border border-[#262626] text-center shadow-lg"
    >
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161616] border border-[#262626] text-2xl">
            <IconToken className="w-6 h-6 text-[#26d464]" />
          </span>
        </div>

        <div>
          <Badge variant="accent" size="sm">
            Protected Action
          </Badge>
          <h3
            id="auth-guard-title"
            className="mt-2 text-xl font-bold text-[#ededed] font-display"
          >
            {title}
          </h3>
          <p
            id="auth-guard-desc"
            className="mt-1 text-xs text-[#a1a1aa] leading-relaxed"
          >
            {description}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400"
          >
            {error}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            isLoading={isConnecting}
            onClick={connect}
            className="w-full sm:w-auto"
          >
            Connect Wallet
          </Button>
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full">
              Full Onboarding Setup →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
