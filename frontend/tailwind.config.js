import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // ── Primary brand — matches logo navy ──
        "brand-navy":    "#1A1F3C",   // logo dark navy (primary)
        "brand-navy-2":  "#252B4A",   // slightly lighter navy
        "brand-navy-3":  "#2F3660",   // medium navy for hover states
        "brand-orange":  "#E8431A",   // logo orange-red (accent)
        "brand-orange-2":"#D03A14",   // darker orange for hover

        // ── Neutral surface ──
        "warm-white":    "#F9F8F6",   // off-white background
        "surface":       "#FFFFFF",   // card white
        "surface-2":     "#F4F3F0",   // subtle grey surface
        "border-light":  "#E8E6E2",   // light border
        "border-mid":    "#D4D1CB",   // medium border

        // ── Text ──
        "text-primary":  "#111318",   // near-black
        "text-secondary":"#5A5A65",   // muted grey
        "text-hint":     "#9A9AA5",   // placeholder / hint

        // ── Legacy aliases (keep for backward compat) ──
        "plum-deep":    "#1A1F3C",
        "plum-darker":  "#13172E",
        "plum-light":   "#2F3660",
        "plum-hover":   "#252B4A",
        "coral-accent": "#E8431A",
        "coral-dark":   "#D03A14",
        "stone-light":  "#F4F3F0",
        "stone-border": "#E8E6E2",
        "beige-warm":   "#F0EDE7",
        "text-dark":    "#111318",
        "text-muted":   "#5A5A65",
        "sidebar-bg":   "#ECEAE6",
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        "soft-plum":          "0 10px 20px rgba(26,31,60,0.12)",
        "architectural":      "0 10px 40px -10px rgba(0,0,0,0.07)",
        "architectural-lg":   "0 20px 60px -12px rgba(0,0,0,0.18)",
        "architectural-xl":   "0 30px 70px -10px rgba(26,31,60,0.22)",
        "card-default":       "0 2px 8px rgba(0,0,0,0.06)",
        "card-enhanced":      "0 4px 16px rgba(0,0,0,0.08)",
        "card-hover":         "0 12px 32px rgba(26,31,60,0.12)",
        "image-card":         "0 8px 24px rgba(0,0,0,0.08)",
        "product-card":       "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)",
        "product-img-shadow": "0 4px 12px rgba(0,0,0,0.08)",
        "glow-coral":         "0 0 32px 8px rgba(232,67,26,0.25)",
      },

      backgroundImage: {
        "dot-pattern": "radial-gradient(#CFC8BD 1px, transparent 1px)",
      },

      fontSize: {
        "display-xl": ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["2.75rem", { lineHeight: "1.12", letterSpacing: "-0.02em",  fontWeight: "800" }],
        "display-md": ["2rem",    { lineHeight: "1.2",  letterSpacing: "-0.015em", fontWeight: "700" }],
        "h2":         ["2rem",    { lineHeight: "1.25", letterSpacing: "-0.01em",  fontWeight: "700" }],
        "h3":         ["1.375rem",{ lineHeight: "1.4",  letterSpacing: "-0.005em", fontWeight: "600" }],
        "body":       ["1rem",    { lineHeight: "1.65" }],
        "caption":    ["0.8125rem",{ lineHeight: "1.5" }],
      },

      spacing: {
        "4":  "4px",
        "8":  "8px",
        "12": "12px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "64": "64px",
      },

      maxWidth: {
        "container": "1200px",
      },

      borderRadius: {
        "card":   "12px",
        "btn":    "8px",
        "pill":   "9999px",
      },
    },
  },

  plugins: [
    forms,
    containerQueries,
  ],
};
