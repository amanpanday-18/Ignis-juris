/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37', // Classic Gold
          light: '#e6c96e',
          dark: '#b5952f',
          900: '#4a3d13',
        },
        accent: {
          DEFAULT: '#f59e0b', // Rich Amber
          hover: '#d97706',
          light: '#fbbf24',
        },
        background: '#0a0a0a', // Deep Charcoal/Onyx
        surface: '#171717',    // Slightly lighter charcoal for cards
        'surface-light': '#262626',
        text: {
          primary: '#f8fafc',
          secondary: '#d1d5db',
          muted: '#9ca3af',
        },
        indigo: {
          950: '#0a0a0a', // Override indigo 950 to match background just in case it's hardcoded somewhere
        },
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}

