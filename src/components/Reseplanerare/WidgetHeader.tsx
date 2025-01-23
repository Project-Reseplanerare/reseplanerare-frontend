function WidgetHeader() {
  return (
    <div className="flex flex-col items-center justify-center bg-white text-center p-4 border border-gray-300 rounded-lg">
      <h1
        className="mb-4"
        style={{
          fontFamily: 'Noto Serif, serif',
          fontSize: '32px',
        }}
      >
        Reseplaneraren
      </h1>
      <div style={{ backgroundColor: "#0495A2" }} className="h-0.5 w-full mb-4"></div>
      <p
        className="text-base max-w-lg mb-2"
        style={{ fontFamily: 'Noto Sans, sans-serif' }}
      >
        Med Värmlands nya Reseplanerare blir det enkelt för dig att planera resan. Fyll i vart du vill åka, så får du direkt den bästa rutten på kartan.
      </p>
      <p
        className="text-base max-w-lg"
        style={{ fontFamily: 'Noto Sans, sans-serif' }}
      >
        Vill du upptäcka något nytt? Klicka på "Utforska-knappen" och hitta restauranger och platser nära dig - snabbt och smidigt!
      </p>
    </div>
  );
}

export default WidgetHeader;