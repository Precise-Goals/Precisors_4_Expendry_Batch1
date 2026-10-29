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
          DEFAULT: "#ffffff",
          dark: "#f4f4f5",
          light: "#ffffff",
        },
        accent: {
          DEFAULT: "#16a34a",
          hover: "#15803d",
          dim: "rgba(22, 163, 74, 0.12)",
        },
        orange: {
          DEFAULT: "#ea580c",
          hover: "#c2410c",
          dim: "rgba(234, 88, 12, 0.12)",
          light: "#f97316",
        },
        secondary: {
          DEFAULT: "#f4f4f5",
          hover: "#e4e4e7",
        },
        surface: {
          DEFAULT: "#ffffff",
          hover: "#f4f4f5",
          elevated: "#ffffff",
        },
        border: {
          DEFAULT: "#e4e4e7",
          bright: "#d4d4d8",
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
