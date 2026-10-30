"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";
import { Button } from "@/components/ui/Button";
import {
  IconAcoustics,
  IconPlay,
  IconPause,
  IconCheck,
  IconAlert,
  IconVolume,
  IconVolumeMute,
} from "@/components/ui/Icons";
import { CHAIN_ID, REWARD_PER_POST, DAILY_CAP } from "shared/constants";

const VETERAN_STORIES = [
  {
    id: "exp-01",
    author: "Rameshwar Patil",
    role: "Master Lathe Operator · 42 Years Exp",
    location: "MIDC Bhosari, Pune, India",
    category: "Harmonic Chatter",
    title: "Taming Spindle Scream on Long-Overhang Inconel 718 Shafts",
    audioDuration: "02:44",
    frequencyHz: 2420,
    summary:
      "When turning 65mm Inconel shafts with a 4.5:1 overhang, CNC chatter usually destroys the insert within 90 seconds. Instead of cranking feed down, I pack an old bicycle inner tube with lead pellets inside the boring bar and dial the spindle to 780 RPM. The harmonic resonance cancels instantly.",
    verifiedOnChain: true,
    txHash: "0x89f4b12c8e23910fbcde7102a3429810ea349182",
    rewardAmount: `${REWARD_PER_POST} EXPEN`,
  },
  {
    id: "exp-02",
    author: "Frank Kowalski",
    role: "Die & Mold Toolroom Foreman · 38 Years Exp",
    location: "Warren Tool & Die, Detroit, USA",
    category: "Thermal Compensation",
    title: "The 7:00 AM Cold-Bed D2 Steel Distortion Offset Trick",
    audioDuration: "03:15",
    frequencyHz: 1480,
    summary:
      "On winter mornings, the machine column grows 0.018mm between 7:00 AM and 11:30 AM as hydraulic oil warms. If you touch off cold, your finish pass is scrap. I program a dummy G04 dwell cycle in air for 12 minutes while running 1,200 RPM on the spindle to stabilize casting temperature before touching off.",
    verifiedOnChain: true,
    txHash: "0x47a9d031f791823abce01982bca8192019810a91",
    rewardAmount: `${REWARD_PER_POST} EXPEN`,
  },
  {
    id: "exp-03",
    author: "Kenji Sato",
    role: "Precision Surface Grinding Veteran · 35 Years Exp",
    location: "Nagoya Toolcraft, Japan",
    category: "Abrasive Dressing",
    title: "Wheel Dressing Sound Test for Sub-Micron Bearing Races",
    audioDuration: "01:58",
    frequencyHz: 3100,
    summary:
      "A diamond dresser doesn't just cut; it sings. If the pitch changes from a dry hiss to a flat rumble, you've loaded aluminum oxide grains into the matrix. A light 0.005mm dress with flood synthetic coolant at high volume restores the mirror finish with zero burn marks.",
    verifiedOnChain: true,
    txHash: "0x12c984ee41029384756182930491827394857102",
    rewardAmount: `${REWARD_PER_POST} EXPEN`,
  },
  {
    id: "exp-04",
    author: "Balwant Singh",
    role: "Heavy Boring Specialist · 29 Years Exp",
    location: "Ludhiana Heavy Machine Cluster, India",
    category: "Deep Hole Fixturing",
    title: "Zero-Vibration Deep Cylinder Boring Using Leather Packing",
    audioDuration: "02:18",
    frequencyHz: 1150,
    summary:
      "When boring thin-walled diesel cylinder sleeves, radial ringing causes ovality. We wrap heavy bridle leather around the outer diameter before clamping the steady rest. The natural collagen fibers absorb vibration better than any commercial rubber damper.",
    verifiedOnChain: true,
    txHash: "0x77ed21ba591823abfced09182938471029384719",
    rewardAmount: `${REWARD_PER_POST} EXPEN`,
  },
];

const MATERIALS = [
  { name: "Inconel 718", hardness: "44 HRC", baseRpm: 1200, resonantFreq: 2420 },
  { name: "AISI 4140 Prehard", hardness: "32 HRC", baseRpm: 2200, resonantFreq: 1850 },
  { name: "Titanium Ti-6Al-4V", hardness: "36 HRC", baseRpm: 1600, resonantFreq: 2100 },
  { name: "Alloy Steel D2", hardness: "58 HRC", baseRpm: 900, resonantFreq: 2900 },
];

export default function ExperiencePage() {
  const shouldReduceMotion = useSafeReducedMotion();
  const [activeStoryId, setActiveStoryId] = useState("exp-01");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [rpm, setRpm] = useState(1800);
  const [overhang, setOverhang] = useState(4);
  const [activeTab, setActiveTab] = useState("All");

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  const currentMat = MATERIALS[selectedMaterial];
  const calculatedResonance = Math.round(
    currentMat.resonantFreq * (1 + (overhang - 3) * 0.15) * (rpm / currentMat.baseRpm)
  );

  const isResonanceZone = Math.abs(rpm - currentMat.baseRpm) < 250 && overhang > 3.5;

  const filteredStories =
    activeTab === "All"
      ? VETERAN_STORIES
      : VETERAN_STORIES.filter((s) => s.category === activeTab);

  // Stop synthetic audio cleanly
  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // Ignored
      }
      oscRef.current = null;
    }
  };

  // Play synthetic tone using Web Audio API
  const playTone = (frequency, dampened = false) => {
    stopTone();
    if (audioMuted) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = dampened ? "sine" : "triangle";
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      const targetGain = dampened ? 0.03 : 0.08;
      gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(targetGain, audioCtxRef.current.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      oscRef.current = osc;
    } catch {
      // Audio autoplay restrictions gracefully handled
    }
  };

  // Handle playing simulated veteran audio log
  const togglePlay = (storyId) => {
    if (activeStoryId === storyId && isPlayingAudio) {
      setIsPlayingAudio(false);
      stopTone();
    } else {
      setActiveStoryId(storyId);
      setIsPlayingAudio(true);
      setAudioProgress(0);
      const story = VETERAN_STORIES.find((s) => s.id === storyId);
      playTone(story?.frequencyHz || 1800, true);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            stopTone();
            return 0;
          }
          return prev + 2.5;
        });
      }, 150);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
      stopTone();
    };
  }, [isPlayingAudio]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-transparent text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 relative">
      {/* ──────────────────────────────────────────────────────────
          1. HEADER: Experience Hub
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Experience Header"
        className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-zinc-200/90 bg-white/70 backdrop-blur-md"
      >
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute top-4 left-4 text-xs font-mono text-zinc-400 font-bold">+ [AUDIO // TACIT EXP]</div>
          <div className="absolute top-4 right-4 text-xs font-mono text-zinc-400 font-bold">+ [MST-{CHAIN_ID}]</div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-zinc-900">Machinist Tacit Audio & Story Archive</span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-mono font-bold text-emerald-700">Earn {REWARD_PER_POST} EXPEN / Valid Entry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 font-montserrat leading-[1.15]">
            Veteran Machinist Tacit Experience Hub
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl font-body">
            Real machine shop know-how lives in acoustic pitch, chip curl color, and tactile vibration.
            Listen to master operators share decades of field-tested tricks that prevent broken tooling,
            dampen chatter, and save thousands in scrap.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/community">
              <Button variant="primary" size="md">
                <span>Share Your Shop Secret</span>
                <span className="ml-2 font-mono">→</span>
              </Button>
            </Link>
            <Link href="/agent">
              <Button variant="secondary" size="md">
                <span>Query Sarvam AI Assistant</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          2. INTERACTIVE ACOUSTIC CHATTER & HARMONICS SIMULATOR
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Harmonics Simulator"
        className="py-14 sm:py-20 border-b border-zinc-200/90 bg-white/40 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconAcoustics className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
                  Interactive Shop-Floor Diagnostic
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                Machinist Harmonic Resonance & Chatter Simulator
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl font-body">
                Adjust tool overhang, workpiece alloy, and spindle speed to see how harmonic vibration develops—and how veteran operators dampen it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAudioMuted(!audioMuted)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-mono font-bold text-zinc-800 hover:bg-zinc-50 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              {audioMuted ? (
                <>
                  <IconVolumeMute className="w-4 h-4 text-zinc-400" />
                  <span>Acoustic Audio Muted</span>
                </>
              ) : (
                <>
                  <IconVolume className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800">Synthesizer Active</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-4xl bg-white border border-zinc-200/90 shadow-xl space-y-5">
              {/* Alloy Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-zinc-500 font-bold block mb-2">
                  Workpiece Material
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIALS.map((mat, idx) => (
                    <button
                      key={mat.name}
                      type="button"
                      onClick={() => setSelectedMaterial(idx)}
                      className={`p-3 rounded-2xl border text-left text-xs font-mono transition cursor-pointer ${
                        selectedMaterial === idx
                          ? "bg-emerald-50/80 border-emerald-600 text-zinc-900 font-bold shadow-xs ring-2 ring-emerald-600/10"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-white"
                      }`}
                    >
                      <div className="truncate font-bold">{mat.name}</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">{mat.hardness}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RPM Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500 font-bold">Spindle Speed (RPM)</span>
                  <span className="text-emerald-700 font-bold">{rpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="4500"
                  step="50"
                  value={rpm}
                  onChange={(e) => setRpm(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>600 RPM</span>
                  <span className="font-bold text-zinc-700">Optimal: {currentMat.baseRpm}</span>
                  <span>4500 RPM</span>
                </div>
              </div>

              {/* Overhang Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500 font-bold">Tool Overhang Ratio (L/D)</span>
                  <span className="text-zinc-900 font-bold">{overhang}:1</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="7"
                  step="0.5"
                  value={overhang}
                  onChange={(e) => setOverhang(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>2:1 (Rigid)</span>
                  <span>4:1 (Standard)</span>
                  <span>7:1 (Extreme)</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Viewport & Readout */}
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-4xl bg-white border border-zinc-200/90 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs font-mono uppercase text-zinc-500 font-bold">
                  Acoustic Spectrum & Waveform
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    isResonanceZone
                      ? "bg-red-50 text-red-700 border border-red-200 shadow-2xs"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                  }`}
                >
                  {isResonanceZone ? "SEVERE CHATTER DETECTED" : "STABLE CUTTING ZONE"}
                </span>
              </div>

              {/* Dynamic Waveform Graph simulation */}
              <div className="h-32 w-full rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-center gap-1.5 relative overflow-hidden">
                <div className="absolute top-2 left-3 text-[11px] font-mono font-bold text-zinc-500">
                  PEAK: {calculatedResonance} Hz · {isResonanceZone ? "AMPLITUDE: 8.4 mm/s (UNSTABLE)" : "AMPLITUDE: 0.9 mm/s (STABLE)"}
                </div>
                {[12, 28, 45, 80, 52, 95, 34, 76, 20, 60, 88, 40, 25, 70, 90, 30, 48, 65, 35, 20].map((h, i) => {
                  const factor = isResonanceZone ? 1.25 : 0.45;
                  const finalHeight = Math.min(100, Math.round(h * factor));
                  return (
                    <motion.div
                      key={i}
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              height: [`${finalHeight}%`, `${Math.max(15, finalHeight * 0.65)}%`, `${finalHeight}%`],
                            }
                      }
                      transition={{
                        duration: 0.7 + (i % 5) * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`w-2 rounded-full transition-all duration-300 ${
                        isResonanceZone ? "bg-red-500" : "bg-emerald-600"
                      }`}
                      style={{ height: `${finalHeight}%` }}
                    />
                  );
                })}
              </div>

              {/* Tacit Advice Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900">
                  {isResonanceZone ? (
                    <IconAlert className="w-4 h-4 text-amber-600" />
                  ) : (
                    <IconCheck className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>Veteran Machinist Diagnostic Recommendation:</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-body">
                  {isResonanceZone
                    ? `Resonance frequency of ${calculatedResonance} Hz coincides with the natural harmonic frequency of ${currentMat.name}. Shift spindle RPM to ${
                        currentMat.baseRpm - 200
                      } RPM or use an anti-vibration damped boring bar with lead filling.`
                    : `Cutting parameters are within the stable lobing window. Feed rate can be maintained at standard chip-load (0.12mm/tooth) with flood coolant.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. VETERAN AUDIO LOGS & EXPERIENCE FEED
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Experience Feed"
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-montserrat">
                Featured Shop-Floor Experience Logs
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-body">
                Listen to authentic setups, audio recordings, and field tricks recorded by master machinists.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {["All", "Harmonic Chatter", "Thermal Compensation", "Deep Hole Fixturing"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`px-3.5 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
                    activeTab === cat
                      ? "bg-emerald-800 border-emerald-800 text-white shadow-xs"
                      : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map((story) => {
              const active = activeStoryId === story.id && isPlayingAudio;
              return (
                <div
                  key={story.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-4 hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                        {story.category}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1 font-bold">
                        <IconCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>MST Verified</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 font-montserrat">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-body">
                      {story.summary}
                    </p>
                  </div>

                  {/* Audio Player Strip */}
                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => togglePlay(story.id)}
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition cursor-pointer ${
                          active
                            ? "bg-emerald-800 text-white shadow-md shadow-emerald-950/20"
                            : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200"
                        }`}
                        aria-label={active ? "Pause audio" : "Play audio log"}
                      >
                        {active ? (
                          <IconPause className="w-4 h-4 text-white" />
                        ) : (
                          <IconPlay className="w-4 h-4 ml-0.5 text-zinc-900" />
                        )}
                      </button>

                      <div className="flex-1 text-xs font-mono">
                        <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                          <span className="font-bold">{active ? "ACOUSTIC LOG PLAYING" : "VETERAN VOICE MEMO"}</span>
                          <span>{story.audioDuration} ({story.frequencyHz} Hz)</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-emerald-600 transition-all duration-200 ${
                              active ? "animate-pulse" : ""
                            }`}
                            style={{ width: active ? `${Math.max(5, audioProgress)}%` : "0%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Author & Reward Badge */}
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
                      <div>
                        <span className="text-zinc-900 font-bold">{story.author}</span>
                        <span className="text-zinc-300"> · </span>
                        <span>{story.location}</span>
                      </div>
                      <div className="text-emerald-700 font-bold">
                        +{story.rewardAmount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. TOKEN REWARD CTA
         ────────────────────────────────────────────────────────── */}
      <section
        aria-label="Contribute CTA"
        className="py-14 max-w-5xl mx-auto my-8 px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="rounded-4xl bg-white border border-zinc-200/90 shadow-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-montserrat">
            Have a Hard-Won Shop Secret?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto font-body">
            Share your fixturing trick, thermal offset, or chatter solution with the community. Valid posts mint {REWARD_PER_POST} EXPEN tokens directly to your wallet on MST Testnet (Chain ID: {CHAIN_ID}, up to {DAILY_CAP} EXPEN daily).
          </p>
          <div className="pt-2">
            <Link href="/community">
              <Button variant="primary" size="lg">
                <span>Compose Experience Post</span>
                <span className="ml-2 font-mono">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
