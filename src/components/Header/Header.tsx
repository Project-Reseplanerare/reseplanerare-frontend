import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Header = () => (
  <header className="shadow-lg backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight w-full">
    <nav className="grid grid-cols-[auto_1fr] items-center">
      <div className="justify-self-start">
        <Link to="/">
          <img
            src={logo}
            alt="Visit Värmland Logo"
            className="h-9 dark:filter dark:invert dark:hue-rotate-180"
          />
        </Link>
      </div>
      <div className="justify-self-end text-darkLight dark:text-lightDark">
        <ThemeSwitch />
      </div>
    </nav>
  </header>
);

export default Header;
