import React, { useState } from 'react';
import TravelOptions from '../TravelOptions/TravelOptions';
import AttractionList from '../Explore/AttractionList';
import Map from '../Map/Map';
const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <section className="bg-lightLight dark:bg-darkDark border border-darkLight dark:border-lightDark w-full text-darkDark dark:text-lightLight p-6 rounded-md grid gap-4">
      {/* Menu Navigation */}
      <nav className="grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === 'resealternativ' ? null : 'resealternativ'
            )
          }
          className={`p-2 border rounded-md transition
        ${
          activeComponent === 'resealternativ'
            ? 'bg-darkLight dark:bg-lightDark text-lightLight dark:text-darkDark'
            : 'bg-lightDark dark:bg-darkLight text-darkDark dark:text-lightLight hover:bg-darkDark dark:hover:bg-lightLight'
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
          className={`p-2 border rounded-md transition
        ${
          activeComponent === 'besoksmal'
            ? 'bg-darkLight dark:bg-lightDark text-lightLight dark:text-darkDark'
            : 'bg-lightDark dark:bg-darkLight text-darkDark dark:text-lightLight hover:bg-darkDark dark:hover:bg-lightLight'
        }`}
        >
          Se och göra i Värmland
        </button>

        <button
          onClick={() =>
            setActiveComponent(activeComponent === 'karta' ? null : 'karta')
          }
          className={`p-2 border rounded-md transition
        ${
          activeComponent === 'karta'
            ? 'bg-darkLight dark:bg-lightDark text-lightLight dark:text-darkDark'
            : 'bg-lightDark dark:bg-darkLight text-darkDark dark:text-lightLight hover:bg-darkDark dark:hover:bg-lightLight'
        }`}
        >
          Karta
        </button>
      </nav>

      {/* Display Components Based on Selection */}
      <div className="grid gap-4">
        {activeComponent === 'resealternativ' && (
          <div className="p-4 bg-lightDark dark:bg-darkLight rounded-md text-darkDark dark:text-lightLight grid gap-4">
            <h3 className="text-lg font-semibold text-darkDark dark:text-lightLight">
              Resealternativ
            </h3>
            <p>Här kan du se olika alternativ för din resa.</p>
            <TravelOptions />
          </div>
        )}

        {activeComponent === 'besoksmal' && (
          <div className="p-4 bg-lightDark dark:bg-darkLight rounded-md text-darkDark dark:text-lightLight grid gap-4">
            <AttractionList
              setSelectedCategory={(category: string) => console.log(category)}
            />
          </div>
        )}

        {activeComponent === 'karta' && (
          <div className="p-4 bg-lightDark dark:bg-darkLight rounded-md text-darkDark dark:text-lightLight grid">
            <h3 className="text-lg font-semibold text-darkDark dark:text-lightLight">
              Karta
            </h3>
            <p>Visa en karta med din resväg och viktiga platser.</p>
            <div className="grid grid-cols-1 h-80">
              <div className="border z-10 border-darkLight dark:border-lightDark rounded-lg overflow-hidden flex flex-grow">
                <Map />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
