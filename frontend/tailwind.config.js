/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "plum-deep":    "#3B2F63",
        "plum-darker":  "#2A2149",
        "plum-light":   "#4F4080",
        "plum-hover":   "#2D244C",
        "warm-white":   "#F8F7F4",
        "coral-accent": "#FF6B6B",
        "coral-dark":   "#E85A5A",
        "stone-light":  "#F1EEE8",
        "stone-border": "#E6E3DD",
        "beige-warm":   "#F3EFE7",
        "text-dark":    "#1C1C1C",
        "text-muted":   "#6E6E73",
        "sidebar-bg":   "#E8E6E3",
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        "soft-plum":          "0 10px 20px rgba(59,47,99,0.12)",
        "architectural":      "0 10px 40px -10px rgba(0,0,0,0.08)",
        "architectural-lg":   "0 20px 60px -12px rgba(0,0,0,0.25)",
        "architectural-xl":   "0 30px 70px -10px rgba(59,47,99,0.3)",
        "card-default":       "0 10px 30px -10px rgba(0,0,0,0.08)",
        "card-enhanced":      "0 15px 40px -10px rgba(0,0,0,0.12)",
        "card-hover":         "0 25px 50px -12px rgba(59,47,99,0.15)",
        "image-card":         "0 15px 30px -5px rgba(0,0,0,0.1)",
        "product-card":       "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        "product-img-shadow": "0 8px 16px -4px rgba(0,0,0,0.1)",
        "glow-coral":         "0 0 40px 10px rgba(255,107,107,0.3)",
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
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
