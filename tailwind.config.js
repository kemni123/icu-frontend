/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#0f4c75",
          2:       "#1b6ca8",
          10:      "#e3f0fb",
          20:      "#b8d9f5",
        },
        accent:  { DEFAULT: "#00b894", bg: "#e0faf4" },
        warn:    { DEFAULT: "#e17055", bg: "#fff0ec" },
        danger:  { DEFAULT: "#c0392b", bg: "#fdecea" },
        icu: {
          bg:     "#eef2f7",
          border: "#d4dce8",
          text:   "#1a2636",
          muted:  "#607590",
          label:  "#334e68",
        },
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "none" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-10px)" }, to: { opacity: "1", transform: "none" } },
        spin:    { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-up":  "fadeUp 0.45s cubic-bezier(.22,1,.36,1)",
        "slide-in": "slideIn 0.3s ease",
        "spin-fast":"spin 0.7s linear infinite",
      },
    },
  },
  plugins: [],
};