"use client";

import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
];

const STORAGE_KEY = "expendry_lang";

export default function LanguageSelector({
  currentLang = "en",
  onLanguageChange,
  className = "",
}) {
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ["en", "hi", "mr"].includes(stored)) {
        const timer = setTimeout(() => {
          setSelectedLang(stored);
          if (onLanguageChange && stored !== currentLang) {
            onLanguageChange(stored);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage exceptions in restricted contexts
    }
  }, [currentLang, onLanguageChange]);

  const handleSelect = (langCode) => {
    setSelectedLang(langCode);
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch {
      // Ignore
    }
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Select assistant language"
      className={`inline-flex items-center p-1 rounded-2xl bg-zinc-100/90 border border-zinc-200/90 ${className}`}
    >
      {LANGUAGES.map((lang) => {
        const isSelected = selectedLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${lang.label} (${lang.nativeName})`}
            onClick={() => handleSelect(lang.code)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-white/80"
            }`}
          >
            <span>{lang.nativeName}</span>
            <span
              className={`text-[10px] uppercase font-mono ${
                isSelected ? "text-emerald-200" : "text-zinc-400"
              }`}
            >
              {lang.code}
            </span>
          </button>
        );
      })}
    </div>
  );
}
