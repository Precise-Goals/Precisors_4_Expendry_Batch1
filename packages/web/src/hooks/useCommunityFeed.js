"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { INITIAL_COMMUNITY_POSTS } from "@/data/seed-posts";

export function useCommunityFeed(filterType = "All", pageSize = 10) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // In-memory cache & deduplication
  const fetchFeed = useCallback(async (isRefresh = false) => {
    setIsLoading(true);
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
      const targetPage = isRefresh ? 1 : page;
      const paginated = filtered.slice(0, targetPage * pageSize);

      setPosts(paginated);
      setHasMore(paginated.length < filtered.length);
      if (isRefresh) setPage(1);
    } catch (err) {
      setError(err.message || "Failed to load community feed.");
    } finally {
      setIsLoading(false);
    }
  }, [filterType, page, pageSize]);

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
