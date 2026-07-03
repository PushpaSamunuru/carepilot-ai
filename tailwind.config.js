/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#010101",
        panel: "#0a0f0f",
        cyan: {
          glow: "#22d3ee",
        },
        emerald: {
          glow: "#34d399",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
