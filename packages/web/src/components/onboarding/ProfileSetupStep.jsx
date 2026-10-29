"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const EVALUATION_PRESETS = [
  {
    label: "Rameshwar Kulkarni (Medical Implant CNC Turning • Pune)",
    data: {
      username: "rameshwar-k",
      email: "rameshwar@kulkarni-precision.in",
      phone: "+91 98230 11452",
      designation: "Chief CNC Turning Specialist (34 Yrs)",
      company: "Biorad Precision Engineering Cluster Pune",
    },
  },
  {
    label: "Devendra Patil (5-Axis Orthopedic Milling Master • Pune)",
    data: {
      username: "devendra-patil",
      email: "devendra@patil-tooling.in",
      phone: "+91 94220 55198",
      designation: "Master 5-Axis VMC Toolmaker (29 Yrs)",
      company: "Patil Precision Implants & Tooling",
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
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className="p-8 bg-white border-zinc-200 shadow-xl rounded-3xl">
        <div className="text-center space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            Step 1 of 2 • Machinist Credentials
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
            Configure Profile
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-body">
            Set up your shop-floor identity, designation, and manufacturing facility.
          </p>
        </div>

        {/* Quick evaluation fill presets */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
          <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold block mb-2">
            Quick Fill Demo Presets:
          </span>
          <div className="flex flex-col gap-2">
            {EVALUATION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.data)}
                className="text-left px-3 py-2 rounded-xl text-xs bg-white border border-zinc-200 hover:border-emerald-500 hover:text-emerald-700 font-mono transition text-zinc-700 shadow-2xs cursor-pointer"
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1"
            >
              Shop-Floor Handle / Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. lathe-master-pune"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition ${
                errors.username
                  ? "border-red-400 focus:ring-1 focus:ring-red-400"
                  : "border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1"
            >
              Work Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="machinist@precision-pune.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition ${
                errors.email
                  ? "border-red-400 focus:ring-1 focus:ring-red-400"
                  : "border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="designation"
                className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1"
              >
                Specialty / Designation *
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. 5-Axis VMC Lead"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition ${
                  errors.designation
                    ? "border-red-400 focus:ring-1 focus:ring-red-400"
                    : "border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                }`}
              />
              {errors.designation && (
                <p className="mt-1 text-xs text-red-600">{errors.designation}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1"
              >
                Facility / Workshop *
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Biorad Medisys Cluster"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition ${
                  errors.company
                    ? "border-red-400 focus:ring-1 focus:ring-red-400"
                    : "border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
                }`}
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-600">{errors.company}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-1"
            >
              Contact Phone (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98230 00000"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 text-xs font-bold font-montserrat hover:bg-zinc-50 transition cursor-pointer"
              >
                ← Back
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold font-montserrat transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Saving Profile..." : "Proceed to BridgeKey Wallet →"}
            </button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
