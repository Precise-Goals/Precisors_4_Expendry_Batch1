"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const EVALUATION_PRESETS = [
  {
    label: "Rameshwar Kulkarni (Aerospace Turning Specialist • Pune)",
    data: {
      username: "rameshwar-k",
      email: "rameshwar@kulkarni-aerospace.in",
      phone: "+91 98230 11452",
      designation: "Chief CNC Turning Specialist (34 Yrs)",
      company: "Kulkarni Aerospace Components Ltd.",
    },
  },
  {
    label: "Devendra Patil (Tool & Die Master • Kolhapur)",
    data: {
      username: "devendra-patil",
      email: "devendra@patil-tooling.in",
      phone: "+91 94220 55198",
      designation: "Master Tool & Die Maker (29 Yrs)",
      company: "Patil Precision Forging & Dies",
    },
  },
];

export default function ProfileSetupStep({
  walletAddress,
  onSubmit,
  onBack,
  isLoading = false,
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, true, onBack);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!formData.username.trim()) {
      errs.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters.";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username.trim())) {
      errs.username = "Username can only contain letters, numbers, hyphens, and underscores.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = "Please enter a valid phone number.";
    }

    if (!formData.designation.trim()) {
      errs.designation = "Machinist designation is required.";
    }

    if (!formData.company.trim()) {
      errs.company = "Company / Workshop name is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (onSubmit) {
        onSubmit({
          ...formData,
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          designation: formData.designation.trim(),
          company: formData.company.trim(),
          walletAddress: walletAddress?.toLowerCase(),
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-step-heading"
        className="p-8 bg-[#121212] border-[#262626] shadow-xl"
      >
        <div className="text-center space-y-3 mb-8">
          <Badge variant="accent" size="sm">
            Step 2 of 3 • Profile Setup
          </Badge>
          <h2
            id="profile-step-heading"
            className="text-2xl font-bold tracking-tight text-[#ededed] font-display"
          >
            Machinist Profile Details
          </h2>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Linked to:{" "}
            <span className="font-mono text-[#26d464] font-medium">
              {walletAddress}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Quick Presets for Live Evaluation & Judging */}
            <motion.div
              variants={itemVariants}
              className="p-3.5 rounded-lg bg-[#181818] border border-[#262626] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  Quick Presets for Live Evaluation &amp; Judging
                </span>
                <span className="text-[10px] text-[#71717a] uppercase font-mono">
                  Autofill
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {EVALUATION_PRESETS.map((preset, index) => (
                  <button
                    key={preset.data.username}
                    type="button"
                    onClick={() => handleApplyPreset(preset.data)}
                    className="flex-1 text-left px-3 py-2 rounded-md bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#26d464]/60 transition-colors text-xs text-[#ededed] focus:outline-none focus:ring-1 focus:ring-[#26d464] cursor-pointer"
                  >
                    <span className="block font-medium text-[#26d464] text-[10px] uppercase tracking-wider mb-0.5">
                      {`Preset ${index + 1}`}
                    </span>
                    <span className="block text-xs text-[#ededed]">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Username */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-[#ededed]"
              >
                Username <span className="text-[#26d464]">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. lathe_master_ramesh"
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? "username-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] ${
                  errors.username ? "border-red-500" : "border-[#262626]"
                }`}
              />
              {errors.username && (
                <p id="username-error" className="text-xs text-red-400 mt-1">
                  {errors.username}
                </p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#ededed]"
              >
                Email Address <span className="text-[#26d464]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="operator@precisionmachining.in"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] ${
                  errors.email ? "border-red-500" : "border-[#262626]"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-400 mt-1">
                  {errors.email}
                </p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-[#ededed]"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] ${
                  errors.phone ? "border-red-500" : "border-[#262626]"
                }`}
              />
              {errors.phone && (
                <p id="phone-error" className="text-xs text-red-400 mt-1">
                  {errors.phone}
                </p>
              )}
            </motion.div>

            {/* Designation */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label
                htmlFor="designation"
                className="block text-xs font-medium text-[#ededed]"
              >
                Machining Designation / Expertise <span className="text-[#26d464]">*</span>
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior CNC Turning Specialist, EDM Toolmaker"
                aria-invalid={Boolean(errors.designation)}
                aria-describedby={errors.designation ? "designation-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] ${
                  errors.designation ? "border-red-500" : "border-[#262626]"
                }`}
              />
              {errors.designation && (
                <p id="designation-error" className="text-xs text-red-400 mt-1">
                  {errors.designation}
                </p>
              )}
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label
                htmlFor="company"
                className="block text-xs font-medium text-[#ededed]"
              >
                Company / Workshop / Toolroom <span className="text-[#26d464]">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Kulkarni Aerospace Precision Components"
                aria-invalid={Boolean(errors.company)}
                aria-describedby={errors.company ? "company-error" : undefined}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border text-sm text-[#ededed] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#26d464] ${
                  errors.company ? "border-red-500" : "border-[#262626]"
                }`}
              />
              {errors.company && (
                <p id="company-error" className="text-xs text-red-400 mt-1">
                  {errors.company}
                </p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="pt-4 flex items-center justify-between gap-4"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                disabled={isLoading}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Complete Registration & Sign In →
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
