/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solaris: {
          orange: '#FF6600', // L'orange du logo
          dark: '#1A1A1A',   // Le gris anthracite des bandeaux
          gray: '#4B5563',   // Pour le texte secondaire
          light: '#F9FAFB',  // Pour les fonds de section
        },
      },
    },
  },
  plugins: [],
}