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
          DEFAULT: '#1c1b1b',
          light: '#474545',
          dark: '#0e0d0d',
          900: '#0e0d0d',
        },
        accent: {
          DEFAULT: '#2d3a2e',
          hover: '#3d4f38',
          light: '#3d4f38',
        },
        background: '#f3f3f3',
        surface: '#ffffff',
        'surface-light': '#f3f3f3',
        border: '#e5e5e5',
        text: {
          primary: '#1c1b1b',
          secondary: '#474545',
          muted: '#888888',
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'],
        serif: ['"Source Sans Pro"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fadeIn': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        }
      },
      boxShadow: {
        'card': '0 2px 16px 0 rgba(28,27,27,0.08)',
        'card-hover': '0 8px 32px 0 rgba(28,27,27,0.14)',
        'navbar': '0 1px 0 0 #e5e5e5',
      }
    },
  },
  plugins: [],
}
