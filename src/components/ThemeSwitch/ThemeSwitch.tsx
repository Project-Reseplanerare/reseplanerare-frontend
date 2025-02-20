import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [isHovered, setIsHovered] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid grid-cols-[min-content_1fr] items-center sm:gap-2 p-2 rounded-md bg-blueLight dark:bg-blueLight text-white hover:scale-105 transition-transform"
    >
      <motion.div
        key={isHovered ? 'hover' : 'default'}
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: -180 }}
        transition={{ duration: 0.3 }}
      >
        <FontAwesomeIcon
          icon={
            isHovered
              ? theme === 'light'
                ? faSun
                : faMoon
              : theme === 'light'
              ? faMoon
              : faSun
          }
          className="h-5 w-5"
        />
      </motion.div>

      <motion.span
        key={isHovered ? 'hoverText' : 'defaultText'}
        transition={{ duration: 0.3 }}
        className="text-sm text-white hidden sm:inline"
      >
        {isHovered
          ? theme === 'light'
            ? 'Light Mode'
            : 'Dark Mode'
          : theme === 'light'
          ? 'Dark Mode'
          : 'Light Mode'}
      </motion.span>
    </button>
  );
};
