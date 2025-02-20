import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ThemeSwitch = () => {
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
    <motion.button
      onClick={toggleTheme}
      className="grid grid-cols-[min-content_1fr] items-center sm:gap-2 p-2 rounded-md bg-blueLight dark:bg-blueLight text-white transition-transform"
    >
      <motion.div
        key={theme}
        className="grid place-items-center"
        initial={{ rotate: 180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: -180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FontAwesomeIcon
          icon={theme === 'light' ? faMoon : faSun}
          className="h-5 w-5"
        />
      </motion.div>
      <span className="text-sm text-white hidden sm:inline">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </motion.button>
  );
};
