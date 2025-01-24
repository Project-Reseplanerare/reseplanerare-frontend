import logo from "../../assets/logotyp-visitvarmland.svg";

function Header() {
  return (
    <header className=" w-full bg-gray-100 border-b flex items-center justify-start h-20">
    <img src={logo} alt='logo-Visit' className="h-10"/>
    </header>
  );
}

export default Header;
