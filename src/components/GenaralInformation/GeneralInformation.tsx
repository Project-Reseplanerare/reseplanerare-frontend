import { useState } from 'react';

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Completely remove from DOM

  return (
    <section className="grid w-full p-6 backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLightrounded shadow-md rounded border-darkLight dark:border-lightDark ">
      {/* Grid container for Close Button & Title */}
      <div className="grid grid-cols-[min-content_min-content_1fr] gap-4 items-center">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-darkLight dark:text-lightDark border border-darkLight dark:border-lightDark 
             font-bold w-8 h-8 flex items-center justify-center rounded-full transition 
             hover:text-white dark:hover:text-white hover:bg-darkLight dark:hover:bg-lightDark"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-darkDark dark:text-lightLight ">
          Reseplaneraren
        </h1>
      </div>

      <hr className="bg-blueLight h-0.5 w-full"></hr>

      {/* Description */}
      <p className="text-darkLight dark:text-lightDark ">
        Reseplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
