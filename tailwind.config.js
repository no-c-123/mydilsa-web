/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        mydilsa: {
          dark: '#2E2E2E',
          steel: '#3B4B63',
          light: '#E8E8E8',
          white: '#FFFFFF',
          accent: '#007ACC',
        },
      },
    },
  },
  plugins: [],
}
