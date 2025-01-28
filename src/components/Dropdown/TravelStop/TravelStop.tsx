import React, { useState } from 'react';
import { FaGasPump, FaChargingStation, FaChevronDown } from 'react-icons/fa';

const travelStopOptions = [
  {
    id: 'electric-pump',
    label: 'Elektrisk Pump',
    icon: <FaChargingStation className="text-3xl text-blue-600" />,
  },
  {
    id: 'gas-pump',
    label: 'Bensinpump',
    icon: <FaGasPump className="text-3xl text-yellow-600" />,
  },
];

const TravelStop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedElectric, setSelectedElectric] = useState('');
  const [selectedGas, setSelectedGas] = useState('');

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    setIsOpen(false);
  };

  const resetToInitial = () => {
    setSelectedOption(null);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full grid gap-4">
      {/* Dropdown Header */}
      {!selectedOption && (
        <button
          className="flex justify-between items-center w-full cursor-pointer rounded-md transition"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-controls="travel-stop-options"
        >
          <h2 className="text-lg font-semibold text-gray-800">Resestopp</h2>
          <div className="flex items-center gap-2">
            <FaChevronDown
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      )}

      {/* Dropdown List */}
      {isOpen && (
        <ul
          id="travel-stop-options"
          className="grid grid-cols-2 gap-4"
          role="menu"
        >
          {travelStopOptions.map((option) => (
            <li
              key={option.id}
              role="menuitem"
              className="flex flex-col items-center text-center"
            >
              <button
                className="flex flex-col items-center gap-2 p-4 w-full rounded-md bg-gray-50 hover:bg-gray-100 transition focus:ring-2 focus:ring-gray-300"
                onClick={() => handleOptionClick(option.id)}
              >
                {option.icon}
                <span className="text-sm text-gray-700">{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Electric Pump Input */}
      {selectedOption === 'electric-pump' && (
        <div className="grid gap-2">
          <label
            htmlFor="electric-input"
            className="text-sm font-semibold text-gray-700"
          >
            Ange uppgifter om Elektrisk Pump:
          </label>
          <input
            type="text"
            id="electric-input"
            className="p-2 border border-gray-400 rounded"
            value={selectedElectric}
            onChange={(e) => setSelectedElectric(e.target.value)}
            placeholder="t.ex. Pump-ID, Plats"
          />
          <button
            className="mt-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={resetToInitial}
          >
            Klart
          </button>
        </div>
      )}

      {/* Gas Pump Input */}
      {selectedOption === 'gas-pump' && (
        <div className="grid gap-2">
          <label
            htmlFor="gas-input"
            className="text-sm font-semibold text-gray-700"
          >
            Ange uppgifter om Bensinpump:
          </label>
          <input
            type="text"
            id="gas-input"
            className="p-2 border border-gray-400 rounded"
            value={selectedGas}
            onChange={(e) => setSelectedGas(e.target.value)}
            placeholder="t.ex. Pump-ID, Plats"
          />
          <button
            className="mt-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={resetToInitial}
          >
            Klart
          </button>
        </div>
      )}
    </div>
  );
};

export default TravelStop;
