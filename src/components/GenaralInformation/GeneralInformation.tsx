import { useState } from 'react';

function GeneralInformation() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="grid grid-cols-1 place-items-center bg-white text-center p-4 border border-gray-300 rounded-lg gap-4">
      <button
        onClick={() => setIsVisible(false)}
        className="bg-red-500 text-white px-2 rounded"
        aria-label="Close"
      >
        Stäng info
      </button>
      <h1 className="text-3xl">Reseplaneraren</h1>
      <div
        style={{ backgroundColor: '#0495A2' }}
        className="h-0.5 w-full"
      ></div>
      <p className="text-base">
        Med Värmlands nya Reseplanerare blir det enkelt för dig att planera
        resan. Fyll i vart du vill åka, så får du direkt den bästa rutten på
        kartan. Vill du upptäcka något nytt? Klicka på "Utforska-knappen" och
        hitta restauranger och platser nära dig - snabbt och smidigt!
      </p>
    </section>
  );
}

export default GeneralInformation;
