/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'euclid-circular-a': ['"Euclid Circular A"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        brandBlue: { DEFAULT: "#0272CE", dark: "#015aa5" },
        brandYellow: { DEFAULT: "#FFD400", dark: "#e6bf00" },
        brandGray: { background: "#f5f6f8" }
      },
      boxShadow: {
        header: "0 1px 2px rgba(0,0,0,0.06)",
        card: "0 1px 3px rgba(0,0,0,0.08)",
        'card-hover': "0 4px 12px rgba(0,0,0,0.15)",
      }
    },
  },
  plugins: [],
}; 