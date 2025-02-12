import { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Completely remove from DOM

  return (
    <section className="w-full bg-lightDark dark:bg-darkLight p-6 rounded-md border border-lightBorder dark:border-lightDark grid gap-4">
      {/* Section 1: Close Button & Title */}
      <div className="relative">
        {/* Title */}
        <h2 className="text-4xl text-darkDark dark:text-lightLight text-center">
          Reseplaneraren
        </h2>

        <hr className="bg-blueLight mt-4 h-0.5 mx-auto w-full"></hr>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight text-sm"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-darkLight dark:text-lightDark text-center">
        Reseplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
