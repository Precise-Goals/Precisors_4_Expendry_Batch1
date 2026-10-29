"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
      className="w-full my-6 p-8 rounded-4xl bg-white border border-zinc-200/90 text-center shadow-xl"
    >
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
            <IconToken className="w-7 h-7 text-emerald-700" />
          </span>
        </div>

        <div>
          <Badge variant="accent" size="sm">
            Protected Action
          </Badge>
          <h3
            id="auth-guard-title"
            className="mt-3 text-xl font-bold text-zinc-900 font-montserrat"
          >
            {title}
          </h3>
          <p
            id="auth-guard-desc"
            className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed font-body"
          >
            {description}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700"
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
