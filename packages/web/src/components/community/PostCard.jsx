"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatAddress } from "@/lib/wallet";
import { EXPLORER_URL } from "shared/constants";

const TYPE_ICONS = {
  Experience: "📘",
  Blueprint: "📐",
  Idea: "💡",
  "Setup Tip": "⚡",
  "Video Note": "🎥",
};

export default function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!post) return null;

  const {
    title,
    content,
    type = "Experience",
    authorWallet,
    authorName,
    authorDesignation,
    expenEarned = 10,
    txHash,
    createdAt,
  } = post;

  const typeIcon = TYPE_ICONS[type] || "🛠️";
  const formattedWallet = authorWallet ? formatAddress(authorWallet) : "Anonymous";

  // Relative timestamp calculation
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "recently";
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "recently";
    }
  };

  const isLongContent = content && content.length > 240;
  const displayContent =
    isLongContent && !isExpanded ? `${content.slice(0, 240)}...` : content;

  return (
    <article
      className="p-6 rounded-2xl bg-[#121212] border border-[#262626] hover:border-[#383838] transition-all space-y-4 shadow-sm"
      aria-labelledby={`post-title-${post.id || title.slice(0, 10)}`}
    >
      {/* Header: Type Badge, Icon, Timestamp, EXPEN Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge type={type} size="sm">
            <span aria-hidden="true" className="mr-0.5">
              {typeIcon}
            </span>
            <span>{type}</span>
          </Badge>
          <span className="text-xs text-[#71717a]">•</span>
          <time dateTime={createdAt} className="text-xs text-[#71717a]">
            {formatRelativeTime(createdAt)}
          </time>
        </div>

        <Badge variant="accent" size="sm" className="font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
          <span>+{expenEarned} EXPEN Earned</span>
        </Badge>
      </div>

      {/* Title */}
      <h3
        id={`post-title-${post.id || title.slice(0, 10)}`}
        className="text-lg font-bold text-[#ededed] font-display leading-snug hover:text-[#26d464] transition-colors"
      >
        {title}
      </h3>

      {/* Content */}
      <div className="text-sm text-[#a1a1aa] leading-relaxed whitespace-pre-line">
        <p>{displayContent}</p>
        {isLongContent && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 text-xs font-semibold text-[#26d464] hover:underline focus:outline-none focus:ring-1 focus:ring-[#26d464] rounded"
          >
            {isExpanded ? "Show less" : "Read full knowledge note →"}
          </button>
        )}
      </div>

      {/* Footer: Author metadata and transaction hash link */}
      <div className="pt-4 border-t border-[#1c1c1c] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-xs">
            👨‍🔧
          </div>
          <div>
            <div className="font-semibold text-[#ededed]">
              {authorName || "Veteran Machinist"}
            </div>
            <div className="text-[11px] text-[#71717a]">
              {authorDesignation || "Shop Floor Operator"} •{" "}
              <span className="font-mono text-[#a1a1aa]">{formattedWallet}</span>
            </div>
          </div>
        </div>

        {txHash && (
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-[#26d464] hover:underline inline-flex items-center gap-1 bg-[#161616] px-2.5 py-1 rounded-md border border-[#262626]"
            title={`Verified on MST Testnet: ${txHash}`}
          >
            <span>Tx: {txHash.slice(0, 10)}...</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
