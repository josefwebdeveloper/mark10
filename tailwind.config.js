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
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        'press-start': ['Press Start 2P', 'cursive'],
      },
      colors: {
        'bg-primary': '#0f172a',
        'bg-secondary': '#1e293b',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        shine: 'shine 3s linear infinite',
      },
    },
  },
  plugins: [],
}
