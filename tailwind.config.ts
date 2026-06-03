import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FDD835",
          deep: "#F9A825",
          pale: "rgba(253,216,53,0.06)",
        },
        surface: {
          page: "#F8F9FB",
          sidebar: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E5E7EB",
          elevated: "#EEF0F3",
        },
        "text-primary": "#0A0A0A",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        brand: "#FDD835",
        status: {
          green: "#16A34A",
          blue: "#2563EB",
          purple: "#7C3AED",
          red: "#DC2626",
          grey: "#64748B",
        },
      },
      fontFamily: {
        satoshi: ["var(--font-satoshi)", "sans-serif"],
        syne: ["var(--font-satoshi)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "var(--shadow-sm)",
        cardHover: "var(--shadow-md)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out forwards",
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
