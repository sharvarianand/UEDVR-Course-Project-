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
        brand: {
          amber: '#F59E0B',
          'amber-hover': '#D97706',
          dark: '#090A0F',
          surface: '#11141D',
          card: '#151924',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: '#94A3B8',
          subtle: '#64748B',
          danger: '#EF4444'
        },
        industrial: {
          950: '#090A0F',
          900: '#0F1219',
          850: '#141822',
          800: '#1B212F',
          700: '#2D3748',
          600: '#4A5568'
        },
        safety: {
          gold: '#F59E0B',
          amber: '#D97706',
          glow: 'rgba(245, 158, 11, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Work Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
