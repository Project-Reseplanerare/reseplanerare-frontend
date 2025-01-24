// FRÅN OCH TILL!!

import { useState } from 'react';
import { useLocationStore } from '../../store/useLocationStore';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const [error, setError] = useState<string | null>(null);

  const { fromAddress, toAddress, setFromAddress, setToAddress } = useLocationStore();

  const swapAddresses = () => {
    setFromAddress(toAddress);
    setToAddress(fromAddress);
  };

  const isSwapDisabled = !fromAddress || !toAddress;


  const parseCoordinates = (address: string) => {
    if (!address) return null;
    
    const coords = address.split(',').map(str => str.trim());
    if (coords.length === 2 && !isNaN(Number(coords[0])) && !isNaN(Number(coords[1]))) {
      return coords.map(coord => Number(coord)) as [number, number];
    }

    return null;
  };

  const handleToAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAddress(value);
    onInputChange('to', value);

 
    const parsedCoords = parseCoordinates(value);
    if (parsedCoords) {
      setError(null);  
    } else {
      setError('Invalid coordinates format. Please enter latitude,longitude.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-center rounded-lg p-4">
        {/* From Address Input */}
        <div className="flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-md font-bold">
            A
          </div>
          <input
            type="text"
            value={fromAddress}
            onChange={(e) => {
              setFromAddress(e.target.value);
              onInputChange('from', e.target.value);
            }}
            className="ml-3 flex-grow text-gray-700 bg-transparent border-none outline-none"
          />
        </div>

        {/* Swap Button */}
        <button
          className={`flex items-center justify-center rounded-full h-12 w-12 border shadow-md focus:outline-none hover:bg-gray-100 ${
            isSwapDisabled
              ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={swapAddresses}
          aria-label="Swap addresses"
          title="Swap addresses"
          disabled={isSwapDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>

        {/* To Address Input */}
        <div className="flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-md font-bold">
            B
          </div>
          <input
            type="text"
            value={toAddress}
            onChange={handleToAddressChange}
            className="ml-3 flex-grow text-gray-700 bg-transparent border-none outline-none"
          />
        </div>
      </div>

      {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
    </>
  );
};

export default TripInput;