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
        // ── PRIMARY — Deep Charcoal ──
        "brand-navy":    "#1A2332",   // deep charcoal-navy (primary)
        "brand-navy-2":  "#22304A",   // slightly lighter
        "brand-navy-3":  "#2C3E55",   // hover state

        // ── ACCENT — Vermillion Red ──
        "brand-orange":  "#C0392B",   // vermillion red CTA
        "brand-orange-2":"#A93226",   // vermillion hover

        // ── SURFACES ──
        "warm-white":    "#F8F7F4",   // page background (warm paper)
        "surface":       "#FFFFFF",   // card white
        "surface-2":     "#F2F1ED",   // subtle warm surface
        "border-light":  "#E4E1DA",   // light warm border
        "border-mid":    "#CCC9C0",   // medium border

        // ── TEXT ──
        "text-primary":  "#0F1923",   // near-black charcoal
        "text-secondary":"#64748B",   // muted slate
        "text-hint":     "#94A3B8",   // placeholder / hint

        // ── Legacy aliases — mapped to new palette ──
        "plum-deep":    "#1A2332",
        "plum-darker":  "#111B28",
        "plum-light":   "#2C3E55",
        "plum-hover":   "#22304A",
        "coral-accent": "#C0392B",
        "coral-dark":   "#A93226",
        "stone-light":  "#F2F1ED",
        "stone-border": "#E4E1DA",
        "beige-warm":   "#EDE9E0",
        "text-dark":    "#0F1923",
        "text-muted":   "#64748B",
        "sidebar-bg":   "#E8E6E0",
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        "soft-plum":          "0 10px 20px rgba(26,35,50,0.12)",
        "architectural":      "0 10px 40px -10px rgba(0,0,0,0.07)",
        "architectural-lg":   "0 20px 60px -12px rgba(0,0,0,0.16)",
        "architectural-xl":   "0 30px 70px -10px rgba(26,35,50,0.20)",
        "card-default":       "0 2px 8px rgba(0,0,0,0.05)",
        "card-enhanced":      "0 4px 16px rgba(0,0,0,0.08)",
        "card-hover":         "0 12px 32px rgba(26,35,50,0.12)",
        "image-card":         "0 8px 24px rgba(0,0,0,0.08)",
        "product-card":       "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)",
        "product-img-shadow": "0 4px 12px rgba(0,0,0,0.08)",
        // Removed glow effect for mobile compatibility
        // "glow-coral":         "0 0 32px 8px rgba(192,57,43,0.28)",
      },

      backgroundImage: {
        "dot-pattern": "radial-gradient(#C8C4BB 1px, transparent 1px)",
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
    forms({ strategy: "class" }),   // ← only apply form styles when class="form-input" etc. — stops @tailwindcss/forms from touching ALL buttons and inputs
    containerQueries,
  ],
};
