"use client";

import React, { useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import PostCard from "@/components/community/PostCard";
import { IconEdit, IconEye, IconSparkles, IconCheck } from "@/components/ui/Icons";
import { POST_TYPES, EXPLORER_URL } from "shared/constants";

export default function PostComposer({ onPostCreated }) {
  return (
    <AuthGuard
      title="Connect Wallet to Share Knowledge"
      description="Veteran machinists earn 10 EXPEN tokens on MST Testnet for every verified shop-floor post (up to 50 EXPEN daily)."
    >
      <ComposerInner onPostCreated={onPostCreated} />
    </AuthGuard>
  );
}

function ComposerInner({ onPostCreated }) {
  const { address } = useWallet();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Setup Tip");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const charCount = content.length;
  const maxChars = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || cleanTitle.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }

    if (!cleanContent || cleanContent.length < 10) {
      setError("Knowledge content must be at least 10 characters long.");
      return;
    }

    if (!address) {
      setError("Please connect your wallet before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          type,
          authorWallet: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish post.");
      }

      setSuccessResult({
        postId: data.postId,
        txHash: data.txHash,
        expenRewarded: data.expenRewarded || 10,
      });

      // Reset form
      setTitle("");
      setContent("");
      setIsPreview(false);

      // Save to client cache so feed refreshes
      const newPost = {
        id: data.postId || `post-${Date.now()}`,
        title: cleanTitle,
        content: cleanContent,
        type,
        authorWallet: address,
        authorName: "Veteran Machinist",
        authorDesignation: "Shop Floor Contributor",
        expenEarned: data.expenRewarded || 10,
        txHash: data.txHash,
        createdAt: new Date().toISOString(),
        rewarded: true,
      };

      try {
        const stored = localStorage.getItem("expendry_custom_posts");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newPost);
        localStorage.setItem("expendry_custom_posts", JSON.stringify(list));
      } catch {
        // ignore
      }

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError(err.message || "Failed to publish post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPost = {
    id: "preview-temp-id",
    title: title || "Untitled Knowledge Note",
    content: content || "Your tacit knowledge note content will render here...",
    type,
    authorWallet: address,
    authorName: "You (Connected Machinist)",
    authorDesignation: "Machining Contributor",
    expenEarned: 10,
    txHash: "0xpreview...pending",
    createdAt: new Date().toISOString(),
  };

  return (
    <Card className="p-6 bg-[#121212] border-[#262626] shadow-lg mb-8">
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center">
            <IconEdit className="w-4 h-4 text-[#26d464]" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#ededed] font-display">
              Contribute Shop-Floor Knowledge
            </h2>
            <p className="text-xs text-[#a1a1aa]">
              Share tacit machining tricks and earn 10 EXPEN on MST testnet.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPreview((prev) => !prev)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#262626] bg-[#161616] text-[#ededed] hover:border-[#383838] transition-colors focus:outline-none focus:ring-1 focus:ring-[#26d464]"
        >
          {isPreview ? (
            <span className="inline-flex items-center gap-1.5"><IconEdit className="w-3.5 h-3.5" /> Edit Mode</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><IconEye className="w-3.5 h-3.5" /> Preview Note</span>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successResult && (
        <div
          role="status"
          className="mb-6 p-4 rounded-xl bg-[#26d464]/10 border border-[#26d464]/30 space-y-2 text-xs text-[#26d464]"
        >
          <div className="flex items-center justify-between font-bold">
            <span className="inline-flex items-center gap-1.5">
              <IconSparkles className="w-4 h-4 text-[#26d464]" />
              <span>Post Published & +{successResult.expenRewarded} EXPEN Minted!</span>
            </span>
            <Badge variant="accent" size="sm">
              MST Testnet
            </Badge>
          </div>
          {successResult.txHash && (
            <p className="font-mono text-[11px] text-[#a1a1aa]">
              Tx Hash:{" "}
              <a
                href={`${EXPLORER_URL}/tx/${successResult.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#26d464] hover:underline"
              >
                {successResult.txHash}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400"
        >
          {error}
        </div>
      )}

      {isPreview ? (
        <div className="space-y-4">
          <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider">
            Live Preview of Rendered Knowledge Card:
          </div>
          <PostCard post={previewPost} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#ededed]">
              Select Knowledge Category
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    type === t
                      ? "bg-[#26d464] text-black border-[#26d464] font-semibold"
                      : "bg-[#161616] text-[#a1a1aa] border-[#262626] hover:text-[#ededed]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="post-title" className="block text-xs font-medium text-[#ededed]">
              Title / Technique Summary <span className="text-[#26d464]">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mitigating Spindle Chatter on Extended Boring Bars"
              maxLength={120}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464]"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="post-content" className="block text-xs font-medium text-[#ededed]">
                Tacit Details & Calibration Notes <span className="text-[#26d464]">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  charCount > maxChars ? "text-red-400" : "text-[#71717a]"
                }`}
              >
                {charCount} / {maxChars}
              </span>
            </div>
            <textarea
              id="post-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail your spindle speeds, coolant setup, fixturing jigs, acoustic feedback, or scrap reduction advice..."
              maxLength={maxChars}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] leading-relaxed resize-y"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#71717a]">
              Mints 10 EXPEN on MST testnet upon verification.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Publish & Claim 10 EXPEN →
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
