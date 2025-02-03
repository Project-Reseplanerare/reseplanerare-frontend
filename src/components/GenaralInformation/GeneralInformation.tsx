import React, { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="bg-gray-100 p-6 rounded-md border grid gap-4 relative">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-lg"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">Om Resplaneraren</h2>

      {/* Description */}
      <p className="text-gray-500 text-sm">
        Resplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
