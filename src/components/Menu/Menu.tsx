import React, { useState } from 'react';
import TravelOptions from '../TravelOptions/TravelOptions';
import AttractionList from '../Explore/AttractionList';
import Map from '../Map/Map';

const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <section className=" rounded-md w-full grid gap-4 bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight">
      {/* Menu Navigation */}
      <nav className="grid grid-cols-3 gap-4">
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === 'resealternativ' ? null : 'resealternativ'
            )
          }
          className={` py-2 border border-lightlightBorder dark:border-lightlight  rounded transition
            ${
              activeComponent === 'resealternativ'
                ? 'bg-blueLight text-lightLight dark:text-lightLight'
                : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight'
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
          className={` py-2 rounded border border-lightlightBorder dark:border-lightlight  transition
      ${
        activeComponent === 'besoksmal'
          ? 'bg-blueLight text-lightLight dark:text-lightLight'
          : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight'
      }`}
        >
          Se och göra
        </button>

        <button
          onClick={() =>
            setActiveComponent(activeComponent === 'karta' ? null : 'karta')
          }
          className={` py-2 rounded border border-lightlightBorder dark:border-lightlight  transition
            ${
              activeComponent === 'karta'
                ? 'bg-blueLight text-lightLight dark:text-lightLight'
                : 'bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight hover:text-darkDark dark:hover:text-lightLight'
            }`}
        >
          Karta
        </button>
      </nav>

      {/* Display Components Based on Selection */}
      <div className="grid grid-cols-1 ">
        {activeComponent === 'resealternativ' ? (
          <TravelOptions />
        ) : activeComponent === 'besoksmal' ? (
          <div className="grid grid-cols-1 ">
            <AttractionList
              setSelectedCategory={(category: string) => console.log(category)}
            />
          </div>
        ) : activeComponent === 'karta' ? (
          <div className="rounded-md grid grid-cols-1 h-80 ">
            <Map />
          </div>
        ) : (
          <div className="hidden"></div>
        )}
      </div>
    </section>
  );
};

export default Menu;
