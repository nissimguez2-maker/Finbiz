import type { Config } from "tailwindcss";

/**
 * Reading-console design system — near-monochrome, one accent.
 *
 * The screen is meant to read as ONE column of script with two quiet edges, not
 * a dashboard. So the palette is deliberately tiny:
 *   bg / fg / muted / border  — the neutral spine
 *   accent                    — a single calm deep blue, used ONLY for beat
 *                               labels, interactive hover/focus, and focus rings
 * Nothing else gets colour. Tokens are CSS variables in index.css so the whole
 * theme lives in one place.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
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
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
      },
      fontFamily: {
        // One sans for everything readable; mono reserved for tiny beat eyebrows
        // and kbd hints only.
        sans: ['"Switzer"', "system-ui", "sans-serif"],
        mono: ['"Outfit"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        // The reading measure for the script column.
        reading: "68ch",
      },
      keyframes: {
        // The only motion in the app: a calm slide for the edge panels.
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.22s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-right": "slide-in-right 0.22s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fade-in 0.18s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
