function Footer() {
  return (
    <div className="w-full bg-[#f9b000] text-white text-center py-4 flex items-center justify-center">
      <a
        href="https://www.varmlandstrafik.se/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2"
      >
        <span>I samarbete med</span>
        <img
          src="../../src/assets/värmlandslogo.png"
          alt="Värmlandstrafik Logo"
          className="h-6 inline-block"
        />
      </a>
    </div>
  );
}

export default Footer;