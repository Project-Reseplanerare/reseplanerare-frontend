import React, { useState } from 'react';
import TravelOptions from '../TravelOptions/TravelOptions';
import { AttractionList } from '../Explore/AttractionList';
import Map from '../Map/Map';

export const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  // Ändrat från selectedCategory till selectedLocations
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);

  const toggleComponent = (component: string) => {
    setActiveComponent(activeComponent === component ? null : component);
  };

  const getButtonClass = (component: string) =>
    `hover:scale-105 transition-transform py-2 rounded border border-lightlightBorder dark:border-lightlight ${
      activeComponent === component
        ? 'bg-blueLight text-lightLight dark:text-lightLight'
        : 'bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight'
    }`;

  return (
    <section className="rounded-md w-full grid gap-4 text-darkDark dark:text-lightLight">
      <nav className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => toggleComponent('resealternativ')}
          className={getButtonClass('resealternativ')}
        >
          Resealternativ
        </button>
        <button
          onClick={() => toggleComponent('besoksmal')}
          className={getButtonClass('besoksmal')}
        >
          Se och göra
        </button>
        <button
          onClick={() => toggleComponent('karta')}
          className={getButtonClass('karta')}
        >
          Karta
        </button>
      </nav>

      <div className="grid grid-cols-1">
        {activeComponent === 'resealternativ' && <TravelOptions />}
        {activeComponent === 'besoksmal' && (
          <div className="grid grid-cols-1">
            <AttractionList
              setSelectedCategory={(places) => {
                console.log('Platser som skickas till kartan:', places);
                setSelectedLocations(places);
              }}
            />
          </div>
        )}
        {activeComponent === 'karta' && (
          <div className="rounded-md grid grid-cols-1 h-80">
            <Map places={selectedLocations} events={[]} />
          </div>
        )}
      </div>
    </section>
  );
};
