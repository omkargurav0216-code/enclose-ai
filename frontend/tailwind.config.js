/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {

      colors: {

        background: "#0f172a",

        panel: "#111827",

        border: "#1f2937",

        accent: "#3b82f6",

        success: "#22c55e",

        warning: "#f59e0b",

        danger: "#ef4444"
      }
    }
  },

  plugins: []
}