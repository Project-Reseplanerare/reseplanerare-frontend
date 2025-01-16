function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex gap-6">
        <a href="#home" className="text-gray-700 font-bold hover:text-blue-500">
          Home
        </a>
        <a
          href="#about"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          About
        </a>
        <a
          href="#services"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          Services
        </a>
        <a
          href="#contact"
          className="text-gray-700 font-bold hover:text-blue-500"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Header;
