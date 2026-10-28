"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import PostCard from "@/components/community/PostCard";
import FilterTabs from "@/components/community/FilterTabs";
import { Button } from "@/components/ui/Button";
import { IconThermal } from "@/components/ui/Icons";

export default function CommunityFeed({ initialType = "All" }) {
  const [activeType, setActiveType] = useState(initialType);
  const { posts, isLoading, error, hasMore, loadMore } = useCommunityFeed(activeType);
  const observerTarget = useRef(null);

  // IntersectionObserver for infinite scrolling / loadMore
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="w-full space-y-6" id="community-feed-panel">
      {/* Post Type Filter Tabs with URL Sync */}
      <FilterTabs activeType={activeType} onSelectType={setActiveType} />

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400"
        >
          {error}
        </div>
      )}

      {/* Feed List */}
      <div
        role="feed"
        aria-busy={isLoading}
        aria-label="Machinist community feed"
        className="space-y-4"
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Non-layout-shift Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 pt-2" aria-label="Loading posts">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-[#1c1c1c] rounded-full" />
                <div className="h-6 w-32 bg-[#1c1c1c] rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-[#1c1c1c] rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#1c1c1c] rounded" />
                <div className="h-4 w-5/6 bg-[#1c1c1c] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Anchor & Load More Fallback */}
      <div ref={observerTarget} className="py-4 text-center">
        {hasMore && !isLoading && (
          <Button variant="secondary" size="md" onClick={loadMore}>
            Load More Posts
          </Button>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-xs text-[#71717a] py-4">
            You have reached the end of the archived tacit knowledge feed.
          </p>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#121212] border border-[#262626] space-y-3">
          <IconThermal className="w-10 h-10 text-[#26d464] mx-auto block" />
          <h4 className="text-base font-bold text-[#ededed]">
            No posts found in {activeType}
          </h4>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
            Be the first veteran machinist to document a note in this category and
            earn 10 EXPEN on MST testnet!
          </p>
        </div>
      )}
    </div>
  );
}
