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
      className="p-2 rounded-lg transition 
                 bg-darkLight text-lightDark hover:bg-darkDark
                 dark:bg-lightDark dark:text-darkLight dark:hover:bg-lightLight"
    >
      {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
    </button>
  );
}

export default ThemeSwitch;
