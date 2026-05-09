/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lufthansa: {
          blue: '#001b48',
          yellow: '#ffbc00',
          hover: '#e6a800',
          bg: '#f4f5f6'
        }
      }
    },
  },
  plugins: [],
}