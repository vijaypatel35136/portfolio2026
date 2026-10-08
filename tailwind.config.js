/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1220',
          800: '#111a2c',
          700: '#1a2238',
          600: '#1F3864',
        },
        teal: {
          400: '#0E7C7B',
          500: '#0E7C7B',
          600: '#0a5f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0E7C7B, 0 0 10px #0E7C7B' },
          '100%': { boxShadow: '0 0 20px #0E7C7B, 0 0 30px #0E7C7B' },
        },
      },
    },
  },
  plugins: [],
}