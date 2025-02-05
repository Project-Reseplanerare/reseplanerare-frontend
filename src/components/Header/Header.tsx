import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

const Header = () => (
  <header className="bg-white w-full p-2 border-b">
    <nav className="grid grid-cols-2 items-center">
      {/* Left: VisitVärmland Logo */}
      <div className="grid place-items-start">
        <Link to="/">
          <img src={logo} alt="Visit Värmland Logo" className="h-9" />
        </Link>
      </div>

      {/* Right: ThemeSwitch component */}
      <div className="grid place-items-end text-gray-600">
        <ThemeSwitch />
      </div>
    </nav>
  </header>
);

export default Header;
