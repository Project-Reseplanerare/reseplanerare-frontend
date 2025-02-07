import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
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
      className="flex items-center justify-center p-2 m-2 rounded-md bg-blueLight dark:bg-blueDark text-darkDark dark:text-lightLight shadow-md hover:shadow-lg hover:scale-105 transition-transform"
    >
      {/* Display Sun or Moon icon */}
      {theme === 'light' ? (
        <FontAwesomeIcon icon={faMoon} className="h-5 w-5 mr-2" />
      ) : (
        <FontAwesomeIcon icon={faSun} className="h-5 w-5 mr-2" />
      )}

      {/* Text next to the icon */}
      <span className="text-sm">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
}

export default ThemeSwitch;
