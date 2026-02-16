/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "plum-deep": "#3B2F63",
        "plum-hover": "#2D244C",
        "warm-white": "#F8F7F4",
        "stone-light": "#E9E4D9",
        "stone-border": "#E6E3DD",
        "text-dark": "#1C1C1C",
        "text-muted": "#6E6E73",
        "coral-accent": "#FF6B5E",
      },

      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        "soft-plum": "0 12px 24px -8px rgba(59,47,99,0.4)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
