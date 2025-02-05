import React, { useState } from 'react';
import TravelOptions from '../TravelOptions/TravelOptions';
import AttractionList from '../Explore/AttractionList';
import Map from '../Map/Map';
const Menu: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <section className="bg-white border border-gray-300 w-full text-gray-100 p-6 rounded-md grid gap-4">
      {/* Menu Navigation */}
      <nav className="grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() =>
            setActiveComponent(
              activeComponent === 'resealternativ' ? null : 'resealternativ'
            )
          }
          className={`p-2 bg-blue-700 rounded-md hover:bg-gray-600 transition ${
            activeComponent === 'resealternativ' ? 'bg-gray-600' : ''
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
          className={`p-2 bg-blue-700 rounded-md hover:bg-gray-600 transition ${
            activeComponent === 'besoksmal' ? 'bg-gray-600' : ''
          }`}
        >
          Se och göra i Värmland
        </button>
        <button
          onClick={() =>
            setActiveComponent(activeComponent === 'karta' ? null : 'karta')
          }
          className={`p-2 bg-blue-700 rounded-md hover:bg-gray-600 transition ${
            activeComponent === 'karta' ? 'bg-gray-600' : ''
          }`}
        >
          Karta
        </button>
      </nav>

      {/* Display Components Based on Selection */}
      <div className="grid gap-4">
        {activeComponent === 'resealternativ' && (
          <div className="p-4 bg-gray-100 rounded-md text-gray-500 grid gap-4">
            <h3 className="text-lg font-semibold text-blue-800">
              Resealternativ
            </h3>
            <p>Här kan du se olika alternativ för din resa.</p>
            <TravelOptions />
          </div>
        )}
        {activeComponent === 'besoksmal' && (
          <div className="p-4 bg-gray-100 rounded-md text-gray-500 grid gap-4">
            {/* <h3 className="text-lg font-semibold text-blue-800">Besöksmål</h3>
            <p>Här hittar du populära besöksmål i Värmland.</p> */}
            <AttractionList setSelectedCategory={(category: string) => console.log(category)} />
          </div>
        )}
        {activeComponent === 'karta' && (
          <div className="p-4 bg-gray-100 rounded-md text-gray-500 grid">
            <h3 className="text-lg font-semibold text-blue-800">Karta</h3>
            <p>Visa en karta med din resväg och viktiga platser.</p>
            <div className="grid grid-cols-1 h-80">
                  <div className="border z-10 border-gray-300 rounded-lg overflow-hidden flex flex-grow">
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