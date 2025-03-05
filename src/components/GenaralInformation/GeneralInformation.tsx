// React import
import { useState } from 'react';

export const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <section
      role="alert"
      className="grid w-full p-6 backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 
        text-darkDark dark:text-lightLight rounded shadow-md border-darkLight dark:border-lightDark"
    >
      <header className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <button
          onClick={() => setIsVisible(false)}
          className="hover:scale-105 transition-transform w-8 h-8 grid place-items-center 
            text-lightDark rounded-full font-bold dark:hover:text-white bg-blueLight"
          aria-label="Close information panel"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold">Reseplaneraren</h1>
      </header>

      <hr className="h-0.5 bg-blueLight" />

      <p className="text-darkLight dark:text-lightDark">
        Reseplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  ) : null;
};
