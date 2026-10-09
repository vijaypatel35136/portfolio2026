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
        // Legacy navy palette — kept for any admin components still using Tailwind navy-* classes
        navy: {
          900: '#090e1a',
          800: '#0d1424',
          700: '#111c33',
          600: '#162240',
        },
        // Legacy teal palette — kept for Tailwind teal-* usage
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0a7c73',
        },
        // CSS var bridges (so bg-[var(--bg-panel)] works without arbitrary value syntax)
        'brand-teal':  'var(--teal-500)',
        'brand-amber': 'var(--amber-400)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        glow:   'glow 2s ease-in-out infinite alternate',
        float:  'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px #0d9488, 0 0 10px #0d9488' },
          '100%': { boxShadow: '0 0 20px #14b8a6, 0 0 30px #14b8a6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}