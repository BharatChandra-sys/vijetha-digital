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
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
