import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch';

export const Header = () => (
  <header className="grid grid-cols-2 items-center shadow-lg backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark p-4 dark:text-lightLight w-full">
    <Link to="/">
      <img
        src={logo}
        alt="Visit Värmland Logo"
        className="h-9 dark:filter dark:invert dark:hue-rotate-180"
      />
    </Link>

    <nav className="justify-self-end" aria-label="Main navigation">
      <ul className="flex list-none p-0 m-0 space-x-4">
        <li>
          <ThemeSwitch />
        </li>
      </ul>
    </nav>
  </header>
);
