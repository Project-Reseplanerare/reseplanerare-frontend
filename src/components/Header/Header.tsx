import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
      {/* Logo */}
      <div className="flex items-center">
        <Link
          to="/home"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          Värmland
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex gap-6">
        <Link
          to="/about"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          About
        </Link>
        <Link
          to="/services"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          Services
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;
