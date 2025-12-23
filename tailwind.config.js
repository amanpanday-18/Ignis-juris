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
          DEFAULT: '#6366f1', // Indigo 500 - New Primary for Dark Mode (Visible on dark bg)
          light: '#818cf8', // Indigo 400
          dark: '#4338ca', // Indigo 700
        },
        accent: {
          DEFAULT: '#fbbf24', // Amber 400 - Brighter Gold for Dark Mode
          hover: '#d97706', // Amber 600
        },
        background: '#0f172a', // Slate 900 - Deep Navy Background
        surface: '#1e293b', // Slate 800 - Lighter for cards
        text: {
          primary: '#f8fafc', // Slate 50
          secondary: '#94a3b8', // Slate 400
          muted: '#64748b', // Slate 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
