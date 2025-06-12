/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B67CA",
        secondary: "#2D3142", 
        accent: "#FF6B6B",
        surface: "#FFFFFF",
        background: "#F8F9FD",
        success: "#4ECDC4",
        warning: "#FFE66D",
        error: "#FF6B6B",
        info: "#4D96FF",
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] 
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}