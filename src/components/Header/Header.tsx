import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Header = () => (
  <header className="bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight w-full p-2 border-b">
    <nav className="grid grid-cols-[auto_1fr] items-center">
      {/* Left: VisitVärmland Logo */}
      <div className="justify-self-start">
        <Link to="/">
          <img src={logo} alt="Visit Värmland Logo" className="h-9" />
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
