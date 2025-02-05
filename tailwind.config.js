// @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Light
        lightLight: '#F9F9F9',
        darkLight: '#1F1F1F',

        // Primary Dark
        darkDark: '#111111',
        lightDark: '#F3F3F3',

        // Accent
        accentDark: '#EBD699',
        accentLight: '#FEECB6',
      },
    },
  },
  plugins: [],
};
