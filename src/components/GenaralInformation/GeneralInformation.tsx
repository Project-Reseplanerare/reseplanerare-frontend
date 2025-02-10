import { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Completely remove from DOM

  return (
    <section className="w-full bg-lightDark dark:bg-darkLight p-6 rounded-md border border-lightBorder dark:border-lightDark grid gap-4">
      {/* Section 1: Close Button & Title */}
      <div className="relative">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-darkDark dark:text-lightLight text-center">
          Om Resplaneraren
        </h2>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-0 text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight text-lg"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-darkLight dark:text-lightDark text-sm text-center">
        Resplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
