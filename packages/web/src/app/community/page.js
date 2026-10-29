import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import CommunityFeed from "@/components/community/CommunityFeed";
import { Badge } from "@/components/ui/Badge";
import { DAILY_CAP, REWARD_PER_POST } from "shared/constants";

const PostComposer = dynamic(
  () => import("@/components/community/PostComposer"),
  {
    loading: () => (
      <div
        aria-label="Loading composer"
        className="w-full p-6 sm:p-8 rounded-3xl bg-white/95 border border-zinc-200/90 mb-8 animate-pulse space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-zinc-200 rounded-full" />
          <div className="h-6 w-20 bg-zinc-200 rounded-full" />
        </div>
        <div className="h-10 w-full bg-zinc-100 rounded-xl" />
        <div className="h-24 w-full bg-zinc-100 rounded-xl" />
      </div>
    ),
  }
);

export const metadata = {
  title: "Community Knowledge Feed — Expendry",
  description:
    "Explore real-world machining tacit knowledge, setups, and blueprints shared by veteran operators on the MST Testnet.",
};

async function CommunityFeedSlot({ searchParams }) {
  const params = await searchParams;
  const initialType = params?.type || "All";
  return <CommunityFeed initialType={initialType} />;
}

export default function CommunityPage({ searchParams }) {
  return (
    <div className="flex-1 flex flex-col bg-transparent min-h-[calc(100vh-4rem)] relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Community Header Shell */}
      <section
        aria-label="Community Header"
        className="border-b border-zinc-200/90 bg-white/70 backdrop-blur-md py-10 sm:py-14"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Community Knowledge Exchange
            </span>
            <span className="text-xs text-zinc-500 font-mono">• {REWARD_PER_POST} EXPEN / Valid Post</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
            Machinist Tacit Knowledge Feed
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed font-body">
            Preserving decades of tooling setups, chatter dampening techniques,
            and shop-floor insights. Contributed by veteran operators and
            rewarded with EXPEN tokens on MST Testnet.
          </p>

          {/* Live Knowledge Ledger Banner */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 text-xs font-mono shadow-md">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-zinc-500">TOTAL ARCHIVED INSIGHTS:</span>
                <span className="text-zinc-900 font-bold">12</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">EXPEN REWARD POOL:</span>
                <span className="text-emerald-700 font-bold">ACTIVE (MST)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">DAILY CAP / WALLET:</span>
                <span className="text-zinc-900 font-bold">{DAILY_CAP} EXPEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feed Slot */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Post Composer wrapped in AuthGuard */}
        <PostComposer />

        {/* Feed List with Filter Tabs */}
        <Suspense
          fallback={
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/90 space-y-4 animate-pulse shadow-sm"
                >
                  <div className="h-6 w-24 bg-zinc-200 rounded-full" />
                  <div className="h-6 w-3/4 bg-zinc-200 rounded" />
                </div>
              ))}
            </div>
          }
        >
          <CommunityFeedSlot searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
