import React, { Suspense } from "react";
import CommunityFeed from "@/components/community/CommunityFeed";
import PostComposer from "@/components/community/PostComposer";
import { Badge } from "@/components/ui/Badge";

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
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Community Header Shell */}
      <section
        aria-label="Community Header"
        className="border-b border-[#1f1f1f] bg-[#0c0c0c] py-10 sm:py-14"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2">
            <Badge variant="accent" size="sm">
              Community Knowledge Exchange
            </Badge>
            <span className="text-xs text-[#71717a]">• 10 EXPEN / Valid Post</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ededed] font-display">
            Machinist Tacit Knowledge Feed
          </h1>
          <p className="text-sm sm:text-base text-[#a1a1aa] max-w-2xl leading-relaxed">
            Preserving decades of tooling setups, chatter dampening techniques,
            and shop-floor insights. Contributed by veteran operators and
            rewarded with EXPEN tokens on MST Testnet.
          </p>
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
                  className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 animate-pulse"
                >
                  <div className="h-6 w-24 bg-[#1c1c1c] rounded-full" />
                  <div className="h-6 w-3/4 bg-[#1c1c1c] rounded" />
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
