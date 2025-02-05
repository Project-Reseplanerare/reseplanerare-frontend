import React, { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="w-full bg-lightDark dark:bg-darkLight p-6 rounded-md border border-darkLight dark:border-lightDark grid gap-4">
      {/* Section 1: Close Button & Title */}
      <div className="grid grid-cols-2">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-darkDark dark:text-lightLight">
          Om Resplaneraren
        </h2>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight text-lg justify-self-end"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-darkLight dark:text-lightDark text-sm">
        Resplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
