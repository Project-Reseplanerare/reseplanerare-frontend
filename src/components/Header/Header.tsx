import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';

const Header = () => (
  <header className="bg-white w-full p-2 border-b">
    <nav className="grid grid-cols-2 items-center">
      {/* Left: VisitVärmland Logo */}
      <div className="grid place-items-start">
        <Link to="/">
          <img src={logo} alt="Visit Värmland Logo" className="h-9" />
        </Link>
      </div>

      {/* Right: Collaboration Notice */}
      <div className="grid place-items-end text-gray-600">
        <Link to="/" className="text-sm hover:text-gray-900 transition">
          I samarbete med <span className="font-semibold">Värmlandstrafik</span>
        </Link>
      </div>
    </nav>
  </header>
);

export default Header;
