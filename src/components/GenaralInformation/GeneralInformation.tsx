import React, { useState } from "react";

const GeneralInformation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section
    className={`w-full bg-lightDark dark:bg-darkLight p-6 rounded-md border border-lightBorder/80 dark:border-lightDark grid gap-4 ${
      isVisible
        ? "opacity-100 h-auto"
        : "opacity-0 h-0 overflow-hidden pointer-events-none"
      }`}
    >
{/* Section 1: Close Button & Title */}
<div className="grid grid-cols-[1fr_1fr] ">

  {/* Title */}
  <div className="grid place-items-center w-full">
    <h2 className="text-2xl font-semibold text-darkDark dark:text-lightLight">
      Om Resplaneraren
    </h2>
  </div>


    {/* Close Button */}
    <div className="grid place-items-center w-full">
    <button
      onClick={() => setIsVisible(false)}
      className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight text-lg"
    >
      ✕
    </button>
  </div>
</div>
      {/* Description */}
      <p className="text-darkLight dark:text-lightDark text-sm text-left w-full">
        Resplaneraren hjälper dig att enkelt hitta och planera dina resor i
        Värmland. Oavsett om du pendlar dagligen eller besöker regionen, ger vår
        tjänst dig de bästa resealternativen i samarbete med Värmlandstrafik.
      </p>
    </section>
  );
};

export default GeneralInformation;
