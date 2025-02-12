import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Header = () => (
  <header className="bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight w-full">
    <nav className="grid grid-cols-[auto_1fr] items-center">
      {/* Left: VisitVärmland Logo */}
      <div className="justify-self-start">
        <Link to="/">
        <img src={logo} alt="Visit Värmland Logo" className="h-9 dark:filter dark:invert dark:hue-rotate-180 " />
        </Link>
      </div>

      {/* Right: ThemeSwitch component */}
      <div className="justify-self-end text-darkLight dark:text-lightDark">
        <ThemeSwitch />
      </div>
    </nav>
  </header>
);

export default Header;