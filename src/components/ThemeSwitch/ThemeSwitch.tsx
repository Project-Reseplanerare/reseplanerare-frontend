import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as
      | 'light'
      | 'dark'
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="grid grid-cols-[min-content_1fr] items-center gap-2 p-2 rounded-md  bg-blueLight dark:bg-blueLight text-white hover:scale-105 transition-transform"
    >
      {/* Sun or Moon icon */}
      {theme === 'light' ? (
        <FontAwesomeIcon icon={faMoon} className="h-5 w-5" />
      ) : (
        <FontAwesomeIcon icon={faSun} className="h-5 w-5" />
      )}

      {/* Text next to the icon, hidden on small screens */}
      <span className="text-sm text-white hidden sm:inline">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
}

export default ThemeSwitch;
