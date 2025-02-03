import { useEffect, useState } from 'react';

function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // sprawdzam czy  motyw istnieje w localStorage
    const storedTheme = localStorage.getItem('theme') as
      | 'light'
      | 'dark'
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
      // Ustawiam klasę dark na html
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Zmieniam klasę dark na html
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 mt-8 mb-8 rounded-lg bg-bgPrimary dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-tSecondary transition"
    >
      Change theme
    </button>
  );
}

export default ThemeSwitch;
