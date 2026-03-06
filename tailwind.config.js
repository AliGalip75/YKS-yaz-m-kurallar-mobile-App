// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--theme-background) / <alpha-value>)",
        surface: "rgb(var(--theme-surface) / <alpha-value>)",
        primary: "rgb(var(--theme-primary) / <alpha-value>)",
        secondary: "rgb(var(--theme-secondary) / <alpha-value>)",
        text: "rgb(var(--theme-text) / <alpha-value>)",
        "text-white": "rgb(var(--theme-text-white) / <alpha-value>)",
        "text-muted": "rgb(var(--theme-text-muted) / <alpha-value>)",
        border: "rgb(var(--theme-border) / <alpha-value>)",
        "border-success": "rgb(var(--theme-border-success) / <alpha-value>)",
        "border-error": "rgb(var(--theme-border-error) / <alpha-value>)",
        "border-primary": "rgb(var(--theme-border-primary) / <alpha-value>)",
        "border-gold": "rgb(var(--theme-border-gold) / <alpha-value>)",
        success: "rgb(var(--theme-success) / <alpha-value>)",
        error: "rgb(var(--theme-error) / <alpha-value>)",
        warning: "rgb(var(--theme-warning) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
