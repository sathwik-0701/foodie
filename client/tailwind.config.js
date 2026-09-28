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
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#e11d48', // Vibrant Food Tech Crimson/Rose
          600: '#be123c',
          700: '#9f1239'
        },
        brand: {
          amber: '#f59e0b',
          emerald: '#10b981',
          dark: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'float': '0 20px 35px -10px rgba(225, 29, 72, 0.2)'
      }
    },
  },
  plugins: [],
}
