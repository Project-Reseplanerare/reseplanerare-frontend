import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <button
      onClick={toggleTheme}
      className="grid grid-cols-[min-content_1fr] items-center sm:gap-2 p-2 rounded-md bg-blueLight dark:bg-blueLight text-white hover:scale-105 transition-transform"
    >
      <FontAwesomeIcon
        icon={theme === 'light' ? faMoon : faSun}
        className="h-5 w-5"
      />
      <span className="text-sm text-white hidden sm:inline">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
};

export default ThemeSwitch;
