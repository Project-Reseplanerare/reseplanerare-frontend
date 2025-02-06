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
        darkDark: '#1F1F1F',
        lightDark: '#F3F3F3',

        // Accent
        accentDark: '#EBD699',
        accentLight: '#FEECB6',

        // Adding Blue color
        blueLight: '#0495A2',
        blueDark: '#005B79',
      },
    },
  },
  plugins: [],
};
