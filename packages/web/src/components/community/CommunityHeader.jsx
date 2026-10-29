"use client";

import React from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useExpenBalance } from "@/hooks/useExpenBalance";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconToken, IconEye } from "@/components/ui/Icons";

export default function CommunityHeader() {
  const { isConnected, address, formattedAddress } = useWallet();
  const { formatted, isLoading } = useExpenBalance(address);

  return (
    <header className="border-b border-zinc-200/90 bg-white/80 backdrop-blur-md sticky top-16 z-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-900 font-montserrat hidden sm:inline">
            Community Knowledge Hub
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden md:inline">
            MST Testnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && address ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Truncated Address */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-800 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{formattedAddress}</span>
              </div>

              {/* Live EXPEN Balance */}
              <Badge variant="accent" size="md" className="font-mono">
                <IconToken className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isLoading ? "Fetching..." : formatted}</span>
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                <IconEye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Read Only Mode</span>
              </span>
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
