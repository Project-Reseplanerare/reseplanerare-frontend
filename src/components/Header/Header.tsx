import { Link } from 'react-router-dom';
import logo from '../../assets/logotyp-visitvarmland.svg';

const Header = () => (
  <header className="w-full bg-gray-100 border-b grid items-center">
    <Link to="/" className="grid place-items-center">
      <img src={logo} alt="Visit Värmland Logo" className="h-12" />
    </Link>
  </header>
);

export default Header;
