"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useExpenBalance } from "@/hooks/useExpenBalance";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CommunityHeader() {
  const { isConnected, address, formattedAddress } = useWallet();
  const { formatted, isLoading } = useExpenBalance(address);

  return (
    <header className="border-b border-[#1f1f1f] bg-[#0d0d0d]/80 backdrop-blur-sm sticky top-16 z-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#ededed] font-display hidden sm:inline">
            Community Knowledge Hub
          </span>
          <span className="text-xs text-[#71717a] hidden md:inline">
            MST Testnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Truncated Address */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161616] border border-[#262626] text-xs font-mono text-[#a1a1aa]">
                <span className="h-2 w-2 rounded-full bg-[#26d464] animate-pulse" />
                <span>{formattedAddress}</span>
              </div>

              {/* Live EXPEN Balance */}
              <Badge variant="accent" size="md" className="font-mono">
                <span aria-hidden="true">🪙</span>
                <span>{isLoading ? "Fetching..." : formatted}</span>
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="default" size="sm">
                👁️ Read Only Mode
              </Badge>
              <Link href="/onboarding">
                <Button variant="primary" size="sm">
                  Connect Wallet to Earn
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
