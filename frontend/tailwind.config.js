/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6fc2ff',
        secondary: '#ef3340',
        accent: '#3a6bff',
        dark: '#090b12',
        light: '#f4f7ff',
        glass: 'rgba(20, 24, 38, 0.64)'
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Oxanium', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 25px rgba(111, 194, 255, 0.35)',
        premium: '0 20px 60px rgba(0, 0, 0, 0.45)'
      }
    },
  },
  plugins: [],
}
