import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BSA GRC Brand Colors - STRICT COMPLIANCE WITH PRD
        maroon: {
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#f9d0d0",
          300: "#f4aaaa",
          400: "#ec7474",
          500: "#7A0C10", // Primary Maroon - Main Brand
          600: "#680A0E",
          700: "#5A080C", // Dark Maroon - Hover & Depth
          800: "#4A070A",
          900: "#3D0609",
          950: "#210203",
        },
        gold: {
          50: "#fdf9e8",
          100: "#fcf0c2",
          200: "#f9df89",
          300: "#f5c94a",
          400: "#D4AF37", // Premium Gold - Highlight
          500: "#C8A951", // Primary Gold
          600: "#B8932F", // Dark Gold - Hover
          700: "#9A7828",
          800: "#7E6123",
          900: "#69511E",
          950: "#3D2E10",
        },
        primary: {
          DEFAULT: "#7A0C10",
          foreground: "#FFFFFF",
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#f9d0d0",
          300: "#f4aaaa",
          400: "#ec7474",
          500: "#7A0C10",
          600: "#680A0E",
          700: "#5A080C",
          800: "#4A070A",
          900: "#3D0609",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#7A0C10",
        },
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#5A080C",
          light: "#f9df89",
          dark: "#B8932F",
        },
        background: "#FFFFFF",
        foreground: "#1F1F1F",
        muted: {
          DEFAULT: "#F9F5F1",
          foreground: "#6B7280",
        },
        border: "#E8DDD0",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        islamic: ["var(--font-amiri)", "serif"],
      },
      backgroundImage: {
        "gradient-maroon": "linear-gradient(135deg, #7A0C10 0%, #5A080C 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #B8932F 100%)",
        "gradient-soft": "linear-gradient(180deg, #FFFFFF 0%, #F9F5F1 100%)",
        "gradient-hero": "linear-gradient(135deg, #7A0C10 0%, #680A0E 50%, #5A080C 100%)",
        "gradient-premium": "linear-gradient(135deg, #FFFFFF 0%, #FDF9E8 50%, #FFFFFF 100%)",
        "islamic-pattern": "url('/images/islamic-pattern.svg')",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(122, 12, 16, 0.06)",
        medium: "0 4px 20px rgba(122, 12, 16, 0.10)",
        large: "0 10px 40px rgba(122, 12, 16, 0.15)",
        gold: "0 4px 20px rgba(212, 175, 55, 0.25)",
        maroon: "0 4px 20px rgba(122, 12, 16, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
