/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0a0a0a",
          dark: "#000000",
          light: "#141414",
        },
        accent: {
          DEFAULT: "#26d464",
          hover: "#21b856",
          dim: "rgba(38, 212, 100, 0.15)",
        },
        orange: {
          DEFAULT: "#f97316",
          hover: "#ea580c",
          dim: "rgba(249, 115, 22, 0.15)",
          light: "#fb923c",
        },
        secondary: {
          DEFAULT: "#141414",
          hover: "#1f1f1f",
        },
        surface: {
          DEFAULT: "#121212",
          hover: "#1a1a1a",
          elevated: "#222222",
        },
        border: {
          DEFAULT: "#262626",
          bright: "#3f3f46",
        },
      },
      fontFamily: {
        display: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        body: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
