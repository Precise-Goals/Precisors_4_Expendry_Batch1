"use client";

import { useState, useEffect, useCallback } from "react";
import { INITIAL_COMMUNITY_POSTS } from "@/data/seed-posts";

// In-memory stale-while-revalidate cache (TTL: 60 seconds)
export const feedCache = new Map();
export const SWR_TTL_MS = 60 * 1000;

export function useCommunityFeed(filterType = "All", pageSize = 10) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(
    async (isRefresh = false) => {
      const targetPage = isRefresh ? 1 : page;
      const cacheKey = `${filterType}_${targetPage}_${pageSize}`;
      const now = Date.now();

      // Check SWR cache
      const cached = feedCache.get(cacheKey);
      if (cached && !isRefresh) {
        // Serve stale data immediately
        setPosts(cached.posts);
        setHasMore(cached.hasMore);
        setIsLoading(false);

        // If cache is still fresh within TTL, no revalidation needed
        if (now - cached.timestamp < SWR_TTL_MS) {
          return;
        }
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        // Check if client-side posts exist in local storage (newly authored posts)
        let customPosts = [];
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("expendry_custom_posts");
            if (stored) {
              customPosts = JSON.parse(stored);
            }
          } catch {
            // ignore
          }
        }

        // Combine newly created posts with initial seed posts
        const allPosts = [...customPosts, ...INITIAL_COMMUNITY_POSTS];

        // In-memory deduplication by post ID
        const seenIds = new Set();
        const dedupedPosts = [];
        for (const p of allPosts) {
          if (!seenIds.has(p.id)) {
            seenIds.add(p.id);
            dedupedPosts.push(p);
          }
        }

        // Filter by type if not 'All'
        const filtered =
          filterType && filterType !== "All"
            ? dedupedPosts.filter((p) => p.type === filterType)
            : dedupedPosts;

        // Sort descending by creation date
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Paginate
        const paginated = filtered.slice(0, targetPage * pageSize);
        const hasMoreVal = paginated.length < filtered.length;

        // Store in SWR cache
        feedCache.set(cacheKey, {
          posts: paginated,
          hasMore: hasMoreVal,
          timestamp: Date.now(),
        });

        setPosts(paginated);
        setHasMore(hasMoreVal);
        if (isRefresh) setPage(1);
      } catch (err) {
        setError(err.message || "Failed to load community feed.");
      } finally {
        setIsLoading(false);
      }
    },
    [filterType, page, pageSize]
  );

  // Initial load and filter change
  useEffect(() => {
    queueMicrotask(() => {
      fetchFeed(true);
    });
  }, [fetchFeed]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Re-fetch when page increments
  useEffect(() => {
    if (page > 1) {
      queueMicrotask(() => {
        fetchFeed(false);
      });
    }
  }, [page, fetchFeed]);

  const refresh = useCallback(() => {
    return fetchFeed(true);
  }, [fetchFeed]);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

export default useCommunityFeed;
