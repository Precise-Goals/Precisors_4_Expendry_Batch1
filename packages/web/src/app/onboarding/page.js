"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { IconCheck, IconToken, IconExternal } from "@/components/ui/Icons";
import { formatAddress } from "@/lib/wallet";
import { useWallet } from "@/hooks/useWallet";
import { CHAIN_ID } from "shared/constants";

export const EVALUATION_PRESETS = [
  {
    label: "Rameshwar Kulkarni (Aerospace Specialist)",
    data: {
      username: "rameshwar-k",
      name: "Rameshwar Kulkarni",
      designation: "Chief CNC Turning Specialist",
      company: "Kulkarni Aerospace Components Ltd.",
      email: "rameshwar@kulkarni-aerospace.in",
      phone: "+91 98230 11452",
    },
  },
  {
    label: "Devendra Patil (Tool & Die Master)",
    data: {
      username: "devendra-patil",
      name: "Devendra Patil",
      designation: "Master Tool & Die Maker",
      company: "Patil Precision Forging & Dies",
      email: "devendra@patil-tooling.in",
      phone: "+91 94220 55198",
    },
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { connect, address, formattedAddress, isConnected, isConnecting, error: walletError } = useWallet();

  // Stages: "STAGE_1" (Identity), "STAGE_2" (Contact), "STAGE_3" (BridgeKey Mandatory Gate), "DONE"
  const [stage, setStage] = useState("STAGE_1");
  const [walletAddr, setWalletAddr] = useState(null);
  const [walletMsg, setWalletMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    designation: "",
    company: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Auto-populate from Google Auth session if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawSession = sessionStorage.getItem("expendry_user_session");
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session) {
            setFormData((prev) => ({
              ...prev,
              email: prev.email || session.email || "",
              name: prev.name || session.displayName || "",
              username: prev.username || (session.displayName ? session.displayName.toLowerCase().replace(/\s+/g, "-") : ""),
            }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleApplyPreset = (presetData) => {
    setFormData({ ...presetData });
    setErrors({});
  };

  // Validate Stage 1: Name, Designation, Company
  const validateStage1 = () => {
    const errs = {};
    const displayName = (formData.name || formData.username || "").trim();
    if (!displayName) {
      errs.name = "Please enter your name.";
    }
    if (!formData.designation.trim()) {
      errs.designation = "Please enter your role or designation.";
    }
    if (!formData.company.trim()) {
      errs.company = "Please enter your company or workshop.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Stage 2: Email, Phone
  const validateStage2 = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid work email address.";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone or WhatsApp number is required.";
    } else if (!/^\+?[0-9\s-]{7,16}$/.test(formData.phone.trim())) {
      errs.phone = "Please enter a valid phone number (e.g. +91 98230 11452).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStage1Next = (e) => {
    if (e) e.preventDefault();
    if (validateStage1()) {
      setStage("STAGE_2");
    }
  };

  const handleStage2Next = (e) => {
    if (e) e.preventDefault();
    if (validateStage2()) {
      // Save profile draft to session
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("expendry_user_profile", JSON.stringify(formData));
        } catch {
          // ignore
        }
      }
      setStage("STAGE_3");
    }
  };

  // Stage 3: Mandatory BridgeKey Wallet Connect
  const handleConnectBridgeKey = async () => {
    setWalletMsg("");
    try {
      const res = await connect();
      const connectedAddress = res?.address || address;
      if (connectedAddress) {
        setWalletAddr(connectedAddress);
        finalizeOnboarding(connectedAddress);
      }
    } catch {
      // If extension not detected or rejected in dev, check window.ethereum or offer link
      if (typeof window !== "undefined" && (window.ethereum || window.bridgekey)) {
        setWalletMsg("Please authorize the connection in your BridgeKey wallet.");
      } else {
        setWalletMsg("BridgeKey extension not detected. Please install BridgeKey from bridgekey.io to continue.");
      }
    }
  };

  const finalizeOnboarding = (finalAddress) => {
    setIsSubmitting(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "expendry_user_profile",
          JSON.stringify({
            ...formData,
            walletAddress: finalAddress,
            verifiedOnchain: true,
            onboardedAt: new Date().toISOString(),
          })
        );
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      setStage("DONE");
      setIsSubmitting(false);
    }, 400);
  };

  // Progress percentage (hairline indicator)
  const progressPercent =
    stage === "STAGE_1" ? 33 : stage === "STAGE_2" ? 66 : 100;

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 min-h-[calc(100vh-4rem)] selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {/* ──────────────────────────────────────────────────────────
              STAGE 1: NAME, DESIGNATION, COMPANY
             ────────────────────────────────────────────────────────── */}
          {stage === "STAGE_1" && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-3xl space-y-6">
                {/* Hairline Progress Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                    Welcome to Expendry
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 font-poppins">
                    Let's personalize your workspace in the manufacturing knowledge ecosystem.
                  </p>
                </div>

                {/* Quick Presets for Evaluators */}
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                    Quick Preset (Demo &amp; Testing):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EVALUATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleApplyPreset(preset.data)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 hover:border-emerald-500 hover:text-emerald-700 text-xs font-mono font-medium transition cursor-pointer text-zinc-700 shadow-2xs"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleStage1Next} className="space-y-4 text-left">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="onboard-name"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="onboard-name"
                      name="name"
                      type="text"
                      autoFocus
                      value={formData.name || formData.username}
                      onChange={handleChange}
                      placeholder="e.g. Rameshwar Kulkarni"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.name
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600/15"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* Designation / Role */}
                  <div>
                    <label
                      htmlFor="onboard-designation"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5"
                    >
                      Designation / Role
                    </label>
                    <input
                      id="onboard-designation"
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. 5-Axis CNC Milling Specialist"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.designation
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600/15"
                      }`}
                    />
                    {errors.designation && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.designation}</p>
                    )}
                  </div>

                  {/* Company / Workshop */}
                  <div>
                    <label
                      htmlFor="onboard-company"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5"
                    >
                      Company / Workshop
                    </label>
                    <input
                      id="onboard-company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Biorad Medisys Pune"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.company
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600/15"
                      }`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.company}</p>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────
              STAGE 2: WORK EMAIL & PHONE NUMBER
             ────────────────────────────────────────────────────────── */}
          {stage === "STAGE_2" && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-3xl space-y-6">
                {/* Hairline Progress Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                    How can the community reach you?
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 font-poppins">
                    Add your work contact for verified manufacturing collaboration and token rewards.
                  </p>
                </div>

                <form onSubmit={handleStage2Next} className="space-y-4 text-left">
                  {/* Work Email */}
                  <div>
                    <label
                      htmlFor="onboard-email"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5"
                    >
                      Work Email
                    </label>
                    <input
                      id="onboard-email"
                      name="email"
                      type="email"
                      autoFocus
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rameshwar@kulkarni-aerospace.in"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.email
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600/15"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label
                      htmlFor="onboard-phone"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5"
                    >
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="onboard-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98230 11452"
                      className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-zinc-200 focus:border-emerald-600 focus:ring-emerald-600/15"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.phone}</p>
                    )}
                  </div>

                  <div className="pt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStage("STAGE_1")}
                      className="py-3.5 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-sm transition active:scale-[0.98] cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Next: Connect BridgeKey</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────
              STAGE 3: MANDATORY BRIDGEKEY GATE
             ────────────────────────────────────────────────────────── */}
          {stage === "STAGE_3" && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-3xl space-y-6 text-center">
                {/* Hairline Progress Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg">
                    <IconToken className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                    Connect BridgeKey
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-poppins">
                    Link your BridgeKey wallet on MST Testnet (Chain ID {CHAIN_ID}) to sign cryptographic proofs and claim your 50 EXPEN onboarding allocation.
                  </p>
                </div>

                {walletMsg && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left font-mono"
                  >
                    {walletMsg}
                  </div>
                )}

                {/* Primary Action: Connect BridgeKey */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleConnectBridgeKey}
                    disabled={isConnecting || isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide transition shadow-xl shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
                  >
                    <IconToken className="w-5 h-5 text-emerald-400" />
                    <span>{isConnecting ? "Connecting BridgeKey..." : "Connect BridgeKey Wallet"}</span>
                  </button>

                  {/* Direct Download Link for BridgeKey */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-1">
                    <span className="text-xs text-zinc-600 font-body block">
                      BridgeKey extension not installed?
                    </span>
                    <a
                      href="https://bridgekey.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
                    >
                      <span>Get BridgeKey Wallet at bridgekey.io</span>
                      <IconExternal className="w-3.5 h-3.5 text-emerald-700" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <button
                    type="button"
                    onClick={() => setStage("STAGE_2")}
                    className="hover:text-zinc-800 underline cursor-pointer"
                  >
                    ← Edit Contact Details
                  </button>
                  <span className="text-emerald-700 font-bold">Zero Gas · MST #91562037</span>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────
              STAGE: DONE / CELEBRATION
             ────────────────────────────────────────────────────────── */}
          {stage === "DONE" && (
            <motion.div
              key="stage-done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-lg mx-auto"
            >
              <Card className="p-8 bg-white/95 backdrop-blur-2xl border-zinc-200 text-center shadow-2xl rounded-3xl space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-md">
                    <IconCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Verification Complete
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                    Welcome, {formData.name || formData.username || "Machinist"}!
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                    Your profile is linked to your BridgeKey wallet on MST Testnet.
                    You have unlocked your 50 EXPEN onboarding grant.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Wallet:</span>
                    <span className="text-zinc-900 font-bold">
                      {walletAddr ? formatAddress(walletAddr) : "Connected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Designation:</span>
                    <span className="text-emerald-700 font-bold">{formData.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Company:</span>
                    <span className="text-zinc-900">{formData.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Onboarding Grant:</span>
                    <span className="text-emerald-700 font-bold">50 EXPEN Allocated</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/community")}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-montserrat transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Enter Community Feed →
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/showcase")}
                    className="flex-1 py-3.5 px-4 rounded-xl border border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-bold font-montserrat transition active:scale-95 cursor-pointer"
                  >
                    Inspect 3D Implants
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
