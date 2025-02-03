/ @type {import('tailwindcss').Config} */;
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tPrimary: 'var(--color-text-primary)',
        tSecondary: 'var(--color-text-secondary)',
        bgPrimary: 'var(--color-bg-primary)',
        line: 'var(--color-line)',
        lSecondary: 'var(--color-line-secondary)',
        tMedium: 'var(--color-text-medium)',
        bgSecondary: 'var(--color-bg-secondary)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
};
