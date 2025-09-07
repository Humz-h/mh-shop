/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: { DEFAULT: "#0272CE", dark: "#015aa5" },
        brandYellow: { DEFAULT: "#FFD400", dark: "#e6bf00" },
        brandGray: { background: "#f5f6f8" }
      },
      boxShadow: {
        header: "0 1px 2px rgba(0,0,0,0.06)",
        card: "0 1px 3px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
}; 