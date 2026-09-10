/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#050b18',
          850: '#080e1e',
          800: '#0c162e',
          750: '#101d3d',
          700: '#162852',
          600: '#1d356d',
          500: '#254793',
          400: '#3b82f6',
          300: '#60a5fa',
          200: '#93c5fd',
          100: '#dbeafe',
        },
        cyber: {
          900: '#030712',
          800: '#080e1e',
          700: '#0c162e',
          600: '#162852',
          blue: '#2563eb',
          sapphire: '#3b82f6',
          cyan: '#38bdf8',
          neon: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
