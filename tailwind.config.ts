import type { Config } from "tailwindcss";

/**
 * Minimalist Modern design system — token source of truth.
 * Colors are exposed as CSS variables in index.css so they can be themed,
 * and mapped here so Tailwind utilities (bg-accent, text-muted-foreground…) work.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "72rem" },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          secondary: "var(--accent-secondary)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        card: "var(--card)",
        ring: "var(--ring)",
        // semantic lane / status tints (kept restrained, accent stays the hero)
        go: "var(--go)",
        amber: "var(--amber)",
        clay: "var(--clay)",
        // surface-2 — warm-sand resting fill for pills/bubbles (non-white, non-blue)
        "surface-2": {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--surface-2-foreground)",
          border: "var(--surface-2-border)",
        },
      },
      fontFamily: {
        // Two-font system, everywhere: Outfit for headings/labels (Semibold),
        // Switzer for body/reading (Light). "mono" repointed to Outfit so the
        // old font-mono labels render Outfit too — only tabular numerics differ.
        display: ['"Outfit"', "system-ui", "sans-serif"],
        sans: ['"Switzer"', '"Outfit"', "system-ui", "sans-serif"],
        mono: ['"Outfit"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.08)",
        xl: "0 20px 25px rgba(0,0,0,0.1)",
        accent: "0 4px 14px rgba(0,82,255,0.25)",
        "accent-lg": "0 8px 24px rgba(0,82,255,0.35)",
        // soft, accent-tinted layered lift for floating hero cards
        "accent-soft": "0 12px 32px -8px rgba(0,82,255,0.22), 0 2px 8px rgba(15,23,42,0.06)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(to right, var(--accent), var(--accent-secondary))",
        "accent-gradient-br": "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
        "dot-grid": "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
      },
      letterSpacing: {
        label: "0.15em",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        // counter-rotation so an inner ring spins opposite the outer dashed ring
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        // gentle lateral+vertical drift for a secondary floating card
        drift: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(6px, -8px)" },
        },
        // slow breathing opacity for radial accent glows
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 4s ease-in-out infinite",
        "float-slower": "float 7s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "spin-reverse": "spin-reverse 45s linear infinite",
        "glow-pulse": "glow-pulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
