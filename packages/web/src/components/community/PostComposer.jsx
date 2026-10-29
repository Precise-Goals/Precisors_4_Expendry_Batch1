"use client";

import React, { useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import PostCard from "@/components/community/PostCard";
import { IconEdit, IconEye, IconSparkles } from "@/components/ui/Icons";
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
      };

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError(err.message || "Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPost = {
    id: "preview-temp",
    title: title || "Your Knowledge Title Here",
    content:
      content ||
      "Detailed notes on feeds, speeds, chatter damping, fixture parameters, or scrap reduction will appear here in the live preview card...",
    type,
    authorWallet: address,
    authorName: "You (Connected Machinist)",
    authorDesignation: "Machining Contributor",
    expenEarned: 10,
    txHash: "0xpreview...pending",
    createdAt: new Date().toISOString(),
  };

  return (
    <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-xl rounded-3xl mb-8">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-emerald-700 shadow-xs">
            <IconEdit className="w-4 h-4 text-emerald-700" />
          </span>
          <div>
            <h2 className="text-base font-bold text-zinc-900 font-montserrat">
              Contribute Shop-Floor Knowledge
            </h2>
            <p className="text-xs text-zinc-500 font-body">
              Share tacit machining tricks and earn 10 EXPEN on MST testnet.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPreview((prev) => !prev)}
          className="text-xs font-montserrat font-bold px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        >
          {isPreview ? (
            <span className="inline-flex items-center gap-1.5"><IconEdit className="w-3.5 h-3.5 text-emerald-700" /> Edit Mode</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><IconEye className="w-3.5 h-3.5 text-emerald-700" /> Preview Note</span>
          )}
        </button>
      </div>

      {/* Success Notification */}
      {successResult && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-800"
        >
          <div className="flex items-center justify-between font-bold">
            <span className="inline-flex items-center gap-1.5">
              <IconSparkles className="w-4 h-4 text-emerald-700" />
              <span>Post Published & +{successResult.expenRewarded} EXPEN Minted!</span>
            </span>
            <Badge variant="accent" size="sm">
              MST Testnet
            </Badge>
          </div>
          {successResult.txHash && (
            <p className="font-mono text-[11px] text-zinc-600">
              Tx Hash:{" "}
              <a
                href={`${EXPLORER_URL}/tx/${successResult.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold"
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
          className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      {isPreview ? (
        <div className="space-y-4">
          <div className="text-xs text-zinc-500 font-mono font-bold uppercase tracking-wider">
            Live Preview of Rendered Knowledge Card:
          </div>
          <PostCard post={previewPost} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
              Select Knowledge Category
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-montserrat font-semibold transition-all border cursor-pointer ${
                    type === t
                      ? "bg-emerald-800 text-white border-emerald-800 shadow-xs font-bold"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="post-title" className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
              Title / Technique Summary <span className="text-emerald-700">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mitigating Spindle Chatter on Extended Boring Bars"
              maxLength={120}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-body transition"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="post-content" className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                Tacit Details & Calibration Notes <span className="text-emerald-700">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  charCount > maxChars ? "text-red-500 font-bold" : "text-zinc-400"
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
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-body leading-relaxed resize-y transition"
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs text-zinc-500 font-mono">
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
