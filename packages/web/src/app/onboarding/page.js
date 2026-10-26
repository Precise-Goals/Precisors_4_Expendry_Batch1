"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnectStep from "@/components/onboarding/WalletConnectStep";
import ProfileSetupStep from "@/components/onboarding/ProfileSetupStep";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatAddress } from "@/lib/wallet";

const STEPS = [
  { id: "CONNECT", label: "1. Connect Wallet" },
  { id: "PROFILE", label: "2. Machinist Profile" },
  { id: "DONE", label: "3. Complete" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("CONNECT");
  const [walletAddress, setWalletAddress] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    setCurrentStep("PROFILE");
  };

  const handleProfileSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // In production/integration, write to Firestore or auth API
      setProfileData(formData);

      // Persist profile in sessionStorage for seamless client state
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("expendry_user_profile", JSON.stringify(formData));
        } catch {
          // ignore
        }
      }

      setCurrentStep("DONE");
    } catch (err) {
      setSubmitError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Onboarding Header */}
      <div className="w-full max-w-xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ededed] font-display">
          Machinist Onboarding
        </h1>
        <p className="mt-2 text-sm text-[#a1a1aa]">
          Connect your Web3 wallet and configure your machining credentials on MST Testnet.
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
                      ? "bg-[#26d464] text-black"
                      : isCurrent
                      ? "border-2 border-[#26d464] text-[#26d464] bg-[#26d464]/10"
                      : "border border-[#262626] text-[#71717a] bg-[#161616]"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </span>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    isCurrent
                      ? "text-[#ededed] font-semibold"
                      : isCompleted
                      ? "text-[#26d464]"
                      : "text-[#71717a]"
                  }`}
                >
                  {step.label.split(". ")[1]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#26d464] h-full transition-all duration-300 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="w-full max-w-xl mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400"
        >
          {submitError}
        </div>
      )}

      {/* Step Machine Components */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {currentStep === "CONNECT" && (
            <WalletConnectStep
              key="connect-step"
              initialAddress={walletAddress}
              onConnected={handleWalletConnected}
            />
          )}

          {currentStep === "PROFILE" && (
            <ProfileSetupStep
              key="profile-step"
              walletAddress={walletAddress}
              onBack={() => setCurrentStep("CONNECT")}
              onSubmit={handleProfileSubmit}
              isLoading={isSubmitting}
            />
          )}

          {currentStep === "DONE" && (
            <motion.div
              key="done-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg mx-auto"
            >
              <Card className="p-8 bg-[#121212] border-[#262626] text-center shadow-xl space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#26d464]/10 border-2 border-[#26d464] flex items-center justify-center text-3xl shadow-lg shadow-[#26d464]/20 animate-bounce">
                    🎉
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant="accent" size="sm">
                    Onboarding Complete
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-[#ededed] font-display">
                    Welcome to Expendry, {profileData?.username}!
                  </h2>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Your machinist identity is now linked to your wallet on MST Testnet.
                    You are eligible to share tacit knowledge and earn up to 50 EXPEN daily.
                  </p>
                </div>

                {/* Profile Summary Card */}
                <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Wallet:</span>
                    <span className="text-[#ededed]">
                      {walletAddress ? formatAddress(walletAddress) : "Connected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Designation:</span>
                    <span className="text-[#26d464]">{profileData?.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Company:</span>
                    <span className="text-[#ededed]">{profileData?.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">EXPEN Daily Limit:</span>
                    <span className="text-[#26d464]">50 EXPEN (10 EXPEN / Post)</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/community")}
                  className="w-full"
                >
                  Enter Community Feed →
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
