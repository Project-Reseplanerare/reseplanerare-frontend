// FRÅN OCH TILL!!

import { useEffect, useCallback, useState } from 'react';
import { useLocationStore } from '../../store/useLocationStore';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const [error, setError] = useState<string | null>(null);

  const fromAddress = useLocationStore((state) => state.fromAddress);
  const toAddress = useLocationStore((state) => state.toAddress);
  const setFromAddress = useLocationStore((state) => state.setFromAddress);
  const setToAddress = useLocationStore((state) => state.setToAddress);

  const swapAddresses = () => {
    setFromAddress(toAddress);
    setToAddress(fromAddress);
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
          className="flex items-center justify-center bg-white rounded-full h-12 w-12 border border-gray-300 shadow-md focus:outline-none hover:bg-gray-100"
          onClick={swapAddresses}
          aria-label="Swap addresses"
          title="Swap addresses"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 13l4-4m0 0l-4-4m4 4H3"
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
            onChange={(e) => {
              setToAddress(e.target.value);
              onInputChange('to', e.target.value);
            }}
            className="ml-3 flex-grow text-gray-700 bg-transparent border-none outline-none"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  );
};

export default TripInput;