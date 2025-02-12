import React, { useState } from 'react';
import TravelOptions from '../TravelOptions/TravelOptions';
import AttractionList from '../Explore/AttractionList';
import Map from '../Map/Map';

const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <section className=" rounded-md w-full grid gap-4 bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight">
      {/* Menu Navigation */}
      <nav className="grid grid-cols-3 gap-4 text-center justify-center">
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === 'resealternativ' ? null : 'resealternativ'
            )
          }
          className={`px-2 py-4 border border-lightBorder dark:border-white rounded-md transition
            ${activeComponent === 'resealternativ'
                    ? 'bg-blueLight text-lightLight dark:text-lightLight' // Aktiverad färg
                    : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight' // Hover-effekt
                  }`}
        >
          Resealternativ
        </button>

        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === 'besoksmal' ? null : 'besoksmal'
            )
          }
          className={`px-2 py-1 border border-lightBorder dark:border-white rounded-md transition
      ${activeComponent === 'besoksmal'
              ? 'bg-blueLight text-lightLight dark:text-lightLight' // Aktiverad färg
              : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight' // Hover-effekt
            }`}
        >
          Se och göra
        </button>

        <button
          onClick={() =>
            setActiveComponent(activeComponent === 'karta' ? null : 'karta')
          }
          className={`px-2 py-1 border border-lightBorder dark:border-white rounded-md transition
            ${activeComponent === 'karta'
                    ? 'bg-blueLight text-lightLight dark:text-lightLight' // Aktiverad färg
                    : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight' // Hover-effekt
                  }`}
        >
          Karta
        </button>
      </nav>

      {/* Display Components Based on Selection */}
      <div className="grid gap-4">
        {activeComponent === 'resealternativ' && <TravelOptions />}

        {activeComponent === 'besoksmal' && (
          <div className="grid grid-cols-1">
            <AttractionList
              setSelectedCategory={(category: string) => console.log(category)}
            />
          </div>
        )}

        {activeComponent === 'karta' && (
          <div className="rounded-md grid grid-cols-1 h-80 z-10 overflow-hidden">
            <Map />
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;