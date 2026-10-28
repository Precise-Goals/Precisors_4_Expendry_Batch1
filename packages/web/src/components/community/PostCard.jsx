"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatAddress } from "@/lib/wallet";
import { EXPLORER_URL } from "shared/constants";
import {
  IconBlueprint,
  IconBolt,
  IconSparkles,
  IconLathe,
  IconWrench,
  IconCube3D,
} from "@/components/ui/Icons";

function renderTypeIcon(type) {
  switch (type) {
    case "Blueprint":
      return <IconBlueprint className="w-3.5 h-3.5" />;
    case "Setup Tip":
      return <IconBolt className="w-3.5 h-3.5" />;
    case "Idea":
      return <IconSparkles className="w-3.5 h-3.5" />;
    case "Video Note":
      return <IconCube3D className="w-3.5 h-3.5" />;
    case "Experience":
    default:
      return <IconLathe className="w-3.5 h-3.5" />;
  }
}

function getEngineeringParameters(post) {
  if (post.parameters) return post.parameters;
  const text = `${post.title || ""} ${post.content || ""}`.toLowerCase();
  let material = "Alloy Steel";
  let tool = "Indexable Carbide";
  let tolerance = "±0.01 mm";

  if (text.includes("inconel")) material = "Inconel 718";
  else if (text.includes("d2")) material = "D2 Die Steel (60 HRC)";
  else if (text.includes("aluminum")) material = "7075-T6 Aluminum";
  else if (text.includes("titanium")) material = "Ti-6Al-4V Grade 5";
  else if (text.includes("carbide")) material = "Alloy Tool Steel";

  if (text.includes("coolant") || text.includes("flank")) tool = "High-Pressure Flank";
  else if (text.includes("fixturing") || text.includes("impeller")) tool = "Modular Fixture Jig";
  else if (text.includes("boring")) tool = "Tuned Boring Bar";
  else if (text.includes("ceramic")) tool = "Mixed Alumina-TiC";
  else if (text.includes("drilling") || text.includes("peck")) tool = "Micro-Drill Geometry";

  if (text.includes("70-bar") || text.includes("70 bar")) tolerance = "70 Bar // 0.08 mm/rev";
  else if (text.includes("12,000 rpm")) tolerance = "12,000 RPM // ±0.005mm";
  else if (text.includes("micron") || text.includes("microns")) tolerance = "±0.002mm Drift";
  else if (text.includes("120 m/min")) tolerance = "120 m/min Dry";
  else tolerance = "ISO 2768-mK";

  return { material, tool, tolerance };
}

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

  const formattedWallet = authorWallet ? formatAddress(authorWallet) : "Anonymous";
  const params = getEngineeringParameters(post);

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
      className="p-6 rounded-2xl bg-[#121212] border border-[#262626] hover:border-[#383838] transition-all space-y-4 shadow-xl specular-card"
      aria-labelledby={`post-title-${post.id || title.slice(0, 10)}`}
    >
      {/* Header: Type Badge, Icon, Timestamp, EXPEN Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge type={type} size="sm">
            <span aria-hidden="true" className="mr-1 inline-flex items-center">
              {renderTypeIcon(type)}
            </span>
            <span>{type}</span>
          </Badge>
          <span className="text-xs text-[#71717a]">•</span>
          <time dateTime={createdAt} className="text-xs text-[#71717a] font-mono">
            {formatRelativeTime(createdAt)}
          </time>
        </div>

        <Badge variant="accent" size="sm" className="font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[#26d464] animate-pulse" />
          <span>+{expenEarned} EXPEN Minted</span>
        </Badge>
      </div>

      {/* Title with hover glow */}
      <h3
        id={`post-title-${post.id || title.slice(0, 10)}`}
        className="text-lg font-bold text-[#ededed] font-display leading-snug hover:text-[#26d464] transition-colors"
      >
        {title}
      </h3>

      {/* Engineering Parameter Matrix (3-column micro-grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-[#0a0a0a] border border-[#222222] text-[11px] font-mono">
        <div>
          <span className="text-[#71717a] block text-[9px] uppercase tracking-wider">MATERIAL</span>
          <span className="text-[#ededed] font-semibold truncate block">{params.material}</span>
        </div>
        <div>
          <span className="text-[#71717a] block text-[9px] uppercase tracking-wider">TOOL / PROCESS</span>
          <span className="text-[#ededed] font-semibold truncate block">{params.tool}</span>
        </div>
        <div>
          <span className="text-[#71717a] block text-[9px] uppercase tracking-wider">CALIBRATION</span>
          <span className="text-[#26d464] font-semibold truncate block">{params.tolerance}</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-[#a1a1aa] leading-relaxed whitespace-pre-line">
        <p>{displayContent}</p>
        {isLongContent && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsExpanded((prev) => !prev);
              }
            }}
            aria-expanded={isExpanded}
            className="mt-2 text-xs font-semibold text-[#26d464] hover:underline focus:outline-none focus:ring-1 focus:ring-[#26d464] rounded cursor-pointer font-mono"
          >
            {isExpanded ? "Show less ↑" : "Read full knowledge note →"}
          </button>
        )}
      </div>

      {/* Footer: Author metadata and transaction hash link */}
      <div className="pt-4 border-t border-[#1c1c1c] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-7 w-7 rounded-lg bg-[#1a1a1a] border border-[#333333] flex items-center justify-center shadow-inner">
              <IconWrench className="w-3.5 h-3.5 text-[#26d464]" />
            </div>
            <span
              className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#26d464] text-black text-[8px] font-bold rounded-full flex items-center justify-center"
              title="Verified Veteran Operator"
            >
              ✓
            </span>
          </div>
          <div>
            <div className="font-semibold text-[#ededed] flex items-center gap-1.5">
              <span>{authorName || "Veteran Machinist"}</span>
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
            className="text-[11px] font-mono text-[#26d464] hover:underline inline-flex items-center gap-1 bg-[#161616] px-2.5 py-1 rounded-md border border-[#262626] shadow-sm hover:border-[#26d464]/50 transition"
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
