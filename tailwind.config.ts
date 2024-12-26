import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          DEFAULT: "#e57c73",
          hover: "#d66b62",
          light: "rgba(229, 124, 115, 0.1)",
        },
        primary: {
          DEFAULT: "#e57c73",
          hover: "#d66b62",
        },
        secondary: {
          DEFAULT: "#E0E0E0",
          muted: "#B0B0B0",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(to bottom right, #1E1E1E, #2A2A5A)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;