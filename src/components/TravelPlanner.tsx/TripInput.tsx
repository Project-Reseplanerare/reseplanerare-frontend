import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { fetchStops } from '../../utils/api/fetchBusStopsVarm';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const { fromAddress, toAddress, setFromAddress, setToAddress } =
    useLocationStore();
  const { selectedOption } = useTravelOptionsStore();
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);

  const swapAddresses = () => {
    setFromAddress(toAddress);
    setToAddress(fromAddress);
  };

  const isSwapDisabled = !fromAddress || !toAddress;

  const handleFromAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFromAddress(value);
    onInputChange('from', value);

    if (value.trim() && selectedOption === 'Buss') {
      const stops = await fetchStops(value);
      setFromSuggestions(stops.map((stop: { name: any }) => stop.name));
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setToAddress(value);
    onInputChange('to', value);

    if (value.trim() && selectedOption === 'Buss') {
      const stops = await fetchStops(value);
      setToSuggestions(stops.map((stop: { name: any }) => stop.name));
    } else {
      setToSuggestions([]);
    }
  };

  const clearFromInput = () => {
    setFromAddress('');
    setFromSuggestions([]);
  };

  const clearToInput = () => {
    setToAddress('');
    setToSuggestions([]);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* From Address Input */}
      <div className="grid grid-cols-[auto,1fr,auto] items-center w-full border border-gray-300 rounded-lg bg-white p-2">
        {/* Column 1: Address Icon */}
        <div className="flex items-center justify-center w-10 h-10 bg-slate-500 text-white rounded-md font-bold">
          A
        </div>

        {/* Column 2: Input Field */}
        <input
          type="text"
          value={fromAddress}
          onChange={handleFromAddressChange}
          placeholder="Enter departure address"
          className="h-10 w-full text-sm text-gray-900 placeholder-gray-400 px-3 bg-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />

        {/* Column 3: Clear Button */}
        {fromAddress && (
          <button
            onClick={clearFromInput}
            className="px-3 text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}

        {/* From Address Suggestions Dropdown */}
        {fromSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {fromSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition"
                onClick={() => {
                  setFromAddress(suggestion);
                  setFromSuggestions([]);
                  onInputChange('from', suggestion);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Swap Button */}
      <button
        className={`flex items-center justify-center rounded-full h-12 w-12 border focus:outline-none hover:bg-slate-100 ${
          isSwapDisabled
            ? 'bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed'
            : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
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
      <div className="grid grid-cols-[auto,1fr,auto] items-center w-full border border-gray-300 rounded-lg bg-white p-2">
        {/* Column 1: Address Icon */}
        <div className="flex items-center justify-center w-10 h-10 bg-slate-500 text-white rounded-md font-bold">
          B
        </div>

        {/* Column 2: Input Field */}
        <input
          type="text"
          value={toAddress}
          onChange={handleToAddressChange}
          placeholder="Enter destination address"
          className="h-10 w-full text-sm text-gray-900 placeholder-gray-400 px-3 bg-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />

        {/* Column 3: Clear Button */}
        {toAddress && (
          <button
            onClick={clearToInput}
            className="px-3 text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}

        {/* To Address Suggestions Dropdown */}
        {toSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {toSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition"
                onClick={() => {
                  setToAddress(suggestion);
                  setToSuggestions([]);
                  onInputChange('to', suggestion);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TripInput;
