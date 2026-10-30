"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { IconCheck, IconToken, IconExternal } from "@/components/ui/Icons";
import { formatAddress } from "@/lib/wallet";
import { useWallet } from "@/hooks/useWallet";
import { CHAIN_ID } from "shared/constants";

// Adversarial worst-case dataset for break-ui stress testing (Dev-only)
export const WORST_CASE_DATA = {
  name: "Christopher Alexander Montgomery III",
  designation: "Senior Precision 5-Axis CNC Milling & Turning Specialist, Platform Lead",
  company: "Biorad Medisys & Precision Implant Manufacturing Facilities Pvt. Ltd.",
  email: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
  phone: "+91 98230 11452",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { connect, address, formattedAddress, isConnected, isConnecting, error: walletError } = useWallet();

  // Stages: "STAGE_1" (Identity), "STAGE_2" (Contact), "STAGE_3" (BridgeKey Mandatory Gate), "DONE"
  const [stage, setStage] = useState("STAGE_1");
  const [walletAddr, setWalletAddr] = useState(null);
  const [walletMsg, setWalletMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWorstCaseActive, setIsWorstCaseActive] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("data") === "worst";
    }
    return false;
  });

  const [formData, setFormData] = useState(() => {
    let email = "";
    let name = "";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("data") === "worst") {
        return { ...WORST_CASE_DATA };
      }
      try {
        const rawSession = sessionStorage.getItem("expendry_user_session");
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session) {
            email = session.email || "";
            name = session.displayName || "";
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return {
      name,
      designation: "",
      company: "",
      email,
      phone: "",
    };
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleWorstCase = () => {
    if (!isWorstCaseActive) {
      setFormData({ ...WORST_CASE_DATA });
      setIsWorstCaseActive(true);
      setErrors({});
    } else {
      setFormData({
        name: "",
        designation: "",
        company: "",
        email: "",
        phone: "",
      });
      setIsWorstCaseActive(false);
      setErrors({});
    }
  };

  // Validate Stage 1: Name, Designation, Company
  const validateStage1 = () => {
    const errs = {};
    const displayName = (formData.name || "").trim();
    if (!displayName) {
      errs.name = "Please enter your name.";
    } else if (displayName.length > 80) {
      errs.name = "Name cannot exceed 80 characters.";
    }

    if (!formData.designation.trim()) {
      errs.designation = "Please enter your role or designation.";
    } else if (formData.designation.trim().length > 100) {
      errs.designation = "Designation cannot exceed 100 characters.";
    }

    if (!formData.company.trim()) {
      errs.company = "Please enter your company or workshop.";
    } else if (formData.company.trim().length > 100) {
      errs.company = "Company cannot exceed 100 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Stage 2: Email, Phone
  const validateStage2 = () => {
    const errs = {};
    const emailVal = formData.email.trim();
    if (!emailVal) {
      errs.email = "Work email is required.";
    } else if (emailVal.length > 120) {
      errs.email = "Email cannot exceed 120 characters.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errs.email = "Please enter a valid work email address.";
    }

    const phoneVal = formData.phone.trim();
    if (!phoneVal) {
      errs.phone = "Phone or WhatsApp number is required.";
    } else if (phoneVal.length > 25) {
      errs.phone = "Phone number cannot exceed 25 characters.";
    } else if (!/^\+?[0-9\s-]{7,25}$/.test(phoneVal)) {
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
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent min-h-[calc(100vh-4rem)] selection:bg-emerald-100 selection:text-emerald-900 relative">
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
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 text-zinc-900 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-4xl space-y-6">
                {/* Hairline Progress Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat break-words">
                    Welcome to Expendry
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 font-body">
                    Let&apos;s personalize your workspace in the manufacturing knowledge ecosystem.
                  </p>
                </div>

                <form onSubmit={handleStage1Next} className="space-y-4 text-left">
                  {/* Full Name */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor="onboard-name"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold"
                      >
                        Full Name
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.name.length}/80
                      </span>
                    </div>
                    <input
                      id="onboard-name"
                      name="name"
                      type="text"
                      autoFocus
                      maxLength={80}
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Vikramaditya Salunkhe"
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
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor="onboard-designation"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold"
                      >
                        Designation / Role
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.designation.length}/100
                      </span>
                    </div>
                    <input
                      id="onboard-designation"
                      name="designation"
                      type="text"
                      maxLength={100}
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
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor="onboard-company"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold"
                      >
                        Company / Workshop
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.company.length}/100
                      </span>
                    </div>
                    <input
                      id="onboard-company"
                      name="company"
                      type="text"
                      maxLength={100}
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
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 text-zinc-900 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-4xl space-y-6">
                {/* Hairline Progress Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-100">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat break-words">
                    How can the community reach you?
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 font-body">
                    Add your work contact for verified manufacturing collaboration and token rewards.
                  </p>
                </div>

                <form onSubmit={handleStage2Next} className="space-y-4 text-left">
                  {/* Work Email */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor="onboard-email"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold"
                      >
                        Work Email
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.email.length}/120
                      </span>
                    </div>
                    <input
                      id="onboard-email"
                      name="email"
                      type="email"
                      autoFocus
                      maxLength={120}
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="work.email@company.com"
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
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor="onboard-phone"
                        className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold"
                      >
                        Phone / WhatsApp Number
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {formData.phone.length}/25
                      </span>
                    </div>
                    <input
                      id="onboard-phone"
                      name="phone"
                      type="tel"
                      maxLength={25}
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98230 11452"
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

                  <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStage("STAGE_1")}
                      className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-sm transition active:scale-[0.98] cursor-pointer text-center"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide transition shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
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
              <Card className="relative overflow-hidden p-7 sm:p-9 bg-white/95 text-zinc-900 backdrop-blur-2xl border-zinc-200/90 shadow-2xl rounded-4xl space-y-6 text-center">
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
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat break-words">
                    Connect BridgeKey
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-body">
                    Link your BridgeKey wallet on MST Testnet (Chain ID {CHAIN_ID}) to sign cryptographic proofs and claim your 50 EXPEN onboarding allocation.
                  </p>
                </div>

                {walletMsg && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left font-mono break-words"
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
                    <IconToken className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{isConnecting ? "Connecting BridgeKey..." : "Connect BridgeKey Wallet"}</span>
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
                      <IconExternal className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] font-mono text-zinc-500">
                  <button
                    type="button"
                    onClick={() => setStage("STAGE_2")}
                    className="hover:text-zinc-900 underline cursor-pointer"
                  >
                    ← Edit Contact Details
                  </button>
                  <span className="text-emerald-700 font-bold tracking-tight">Zero Gas · MST #91562037</span>
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
              <Card className="p-8 bg-white/95 text-zinc-900 backdrop-blur-2xl border-zinc-200 text-center shadow-2xl rounded-4xl space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-md">
                    <IconCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Verification Complete
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat break-words">
                    Welcome, {formData.name || "Machinist"}!
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                    Your profile is linked to your BridgeKey wallet on MST Testnet.
                    You have unlocked your 50 EXPEN onboarding grant.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-3 font-mono">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500 flex-shrink-0">Wallet:</span>
                    <span className="text-zinc-900 font-bold text-right min-w-0 break-all">
                      {walletAddr ? formatAddress(walletAddr) : "Connected"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500 flex-shrink-0">Designation:</span>
                    <span className="text-emerald-700 font-bold text-right min-w-0 break-words">
                      {formData.designation}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-zinc-500 flex-shrink-0">Company:</span>
                    <span className="text-zinc-900 text-right min-w-0 break-words">
                      {formData.company}
                    </span>
                  </div>
                  {formData.email && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-zinc-500 flex-shrink-0">Email:</span>
                      <span className="text-zinc-700 text-right min-w-0 break-all">
                        {formData.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4 pt-1 border-t border-zinc-200/60">
                    <span className="text-zinc-500 flex-shrink-0">Onboarding Grant:</span>
                    <span className="text-emerald-700 font-bold text-right">
                      50 EXPEN Allocated
                    </span>
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

      {/* Dev-Only Adversarial Stress Test Toggle (Per break-ui Specification) */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 text-white border border-zinc-700 shadow-2xl backdrop-blur-md text-[11px] font-mono">
            <span className="text-zinc-400 font-semibold">Stress Test:</span>
            <button
              type="button"
              onClick={toggleWorstCase}
              className={`px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer ${
                isWorstCaseActive
                  ? "bg-amber-400 text-zinc-950 shadow-sm"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              {isWorstCaseActive ? "Worst Case Active" : "Worst Case Data"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
