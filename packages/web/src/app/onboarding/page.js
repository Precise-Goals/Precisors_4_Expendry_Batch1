"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnectStep from "@/components/onboarding/WalletConnectStep";
import ProfileSetupStep from "@/components/onboarding/ProfileSetupStep";
import { Card } from "@/components/ui/Card";
import { IconCheck, IconToken } from "@/components/ui/Icons";
import { formatAddress } from "@/lib/wallet";

const STEPS = [
  { id: "PROFILE", label: "1. Machinist Profile" },
  { id: "BRIDGEKEY", label: "2. BridgeKey Wallet" },
  { id: "DONE", label: "3. Complete" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("PROFILE");
  const [walletAddress, setWalletAddress] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pre-fill profile from Google or email session if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawSession = sessionStorage.getItem("expendry_user_session");
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session && !profileData) {
            setProfileData((prev) => ({
              ...prev,
              email: session.email || "",
              username: session.displayName ? session.displayName.toLowerCase().replace(/\s+/g, "-") : "",
            }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleProfileSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      setProfileData(formData);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("expendry_user_profile", JSON.stringify(formData));
        } catch {
          // ignore
        }
      }

      setCurrentStep("BRIDGEKEY");
    } catch (err) {
      setSubmitError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(sessionStorage.getItem("expendry_user_profile") || "{}");
        sessionStorage.setItem(
          "expendry_user_profile",
          JSON.stringify({ ...existing, walletAddress: address, verifiedOnchain: true })
        );
      } catch {
        // ignore
      }
    }
    setCurrentStep("DONE");
  };

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50 min-h-[calc(100vh-4rem)] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Onboarding Header */}
      <div className="w-full max-w-xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
          Machinist Onboarding
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 font-body">
          Configure your manufacturing credentials and link your BridgeKey wallet on MST Testnet.
        </p>
      </div>

      {/* Onboarding Stepper Header */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "border-2 border-emerald-600 text-emerald-700 bg-emerald-50"
                      : "border border-zinc-200 text-zinc-400 bg-white"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </span>
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    isCurrent
                      ? "text-zinc-900 font-bold"
                      : isCompleted
                      ? "text-emerald-700 font-semibold"
                      : "text-zinc-400"
                  }`}
                >
                  {step.label.split(". ")[1]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="w-full max-w-xl mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* Step Machine Components */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {currentStep === "PROFILE" && (
            <ProfileSetupStep
              key="profile-step"
              walletAddress={walletAddress}
              onSubmit={handleProfileSubmit}
              isLoading={isSubmitting}
            />
          )}

          {currentStep === "BRIDGEKEY" && (
            <WalletConnectStep
              key="connect-step"
              initialAddress={walletAddress}
              onConnected={handleWalletConnected}
            />
          )}

          {currentStep === "DONE" && (
            <motion.div
              key="done-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-lg mx-auto"
            >
              <Card className="p-8 bg-white border-zinc-200 text-center shadow-xl rounded-3xl space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-3xl shadow-md">
                    <IconCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Verification Complete
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                    Welcome, {profileData?.username || "Machinist"}!
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                    Your machinist identity is now linked to your BridgeKey wallet on MST Testnet.
                    You have been allocated 25 EXPEN tokens and can earn up to 50 EXPEN daily for sharing shop-floor tacit knowledge.
                  </p>
                </div>

                {/* Profile Summary Card */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">BridgeKey Wallet:</span>
                    <span className="text-zinc-900 font-bold">
                      {walletAddress ? formatAddress(walletAddress) : "Connected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Designation:</span>
                    <span className="text-emerald-700 font-bold">{profileData?.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Company:</span>
                    <span className="text-zinc-900">{profileData?.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">EXPEN Allocation:</span>
                    <span className="text-emerald-700 font-bold">25 EXPEN Welcome Grant</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/marketplace")}
                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white text-xs font-bold font-montserrat transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Explore 3D Implants →
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/agent")}
                    className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-bold font-montserrat transition active:scale-95 cursor-pointer"
                  >
                    Consult Sarvam AI
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
