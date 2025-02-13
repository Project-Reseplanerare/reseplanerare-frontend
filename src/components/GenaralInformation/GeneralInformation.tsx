import { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="grid w-full p-6 backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight rounded shadow-md border-darkLight dark:border-lightDark">
      {/* Header Section */}
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="hover:scale-105 transition-transform w-8 h-8 grid place-items-center text-lightDark rounded-full font-bold dark:hover:text-white bg-blueLight"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold">Reseplaneraren</h1>
      </div>

      <hr className="h-0.5 bg-blueLight" />

      {/* Description */}
      <p className="text-darkLight dark:text-lightDark">
        Reseplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
