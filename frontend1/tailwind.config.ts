import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        blue:   { DEFAULT: '#0071e3', dark: '#0077ed', light: '#e8f0fe' },
        green:  '#34c759',
        gray:   {
          50:  '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#c7c7cc',
          400: '#98989d',
          500: '#6e6e73',
          600: '#48484a',
          700: '#3a3a3c',
          800: '#2c2c2e',
          900: '#1d1d1f',
        },
      },
      screens: {
        xs:  '375px',
        sm:  '640px',
        md:  '734px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl':'1440px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
