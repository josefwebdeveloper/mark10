/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        'press-start': ['Press Start 2P', 'cursive'],
      },
      colors: {
        'bg-primary': '#0f172a',
        'bg-secondary': '#1e293b',
      },
    },
  },
  plugins: [],
}
