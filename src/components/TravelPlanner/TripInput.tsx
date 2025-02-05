import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { useBusStopStore } from '../../store/useBusStopStore';
import { fetchStops } from '../../utils/api/fetchBusStopsVarm';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const { fromAddress, toAddress, setFromAddress, setToAddress } = useLocationStore();
  const { selectedOption } = useTravelOptionsStore();
  const { setFromStopId, setToStopId, fromStopId, toStopId } = useBusStopStore();

  const [fromSuggestions, setFromSuggestions] = useState<{ name: string; extId: string }[]>([]);
  const [toSuggestions, setToSuggestions] = useState<{ name: string; extId: string }[]>([]);

  const handleFromAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAddress(value);
    onInputChange('from', value);

    if (value.trim() && selectedOption === 'Buss') {
      const stops = await fetchStops(value);
      setFromSuggestions(stops.map((stop: { name: any; extId: any; }) => ({ name: stop.name, extId: stop.extId })));
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAddress(value);
    onInputChange('to', value);

    if (value.trim() && selectedOption === 'Buss') {
      const stops = await fetchStops(value);
      setToSuggestions(stops.map((stop: { name: any; extId: any; }) => ({ name: stop.name, extId: stop.extId })));
    } else {
      setToSuggestions([]);
    }
  };

  const clearFromInput = () => {
    setFromAddress('');
    setFromSuggestions([]);
    setFromStopId('');
  };

  const clearToInput = () => {
    setToAddress('');
    setToSuggestions([]);
    setToStopId('');
  };

  const swapAddresses = () => {
    setFromAddress(toAddress);
    setToAddress(fromAddress);
    setFromStopId(toStopId);
    setToStopId(fromStopId);
  };

  const isSwapDisabled = !fromAddress || !toAddress;

  useEffect(() => {
    console.log("Updated fromStopId:", fromStopId);
    console.log("Updated toStopId:", toStopId);
  }, [fromStopId, toStopId]);

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-center rounded-lg p-4">
      {/* From Address Input */}
      <div className="relative flex items-center p-3 border border-slate-300 rounded-md bg-slate-50">
        <div className="flex items-center justify-center w-8 h-8 bg-slate-500 text-white rounded-md font-bold">
          A
        </div>
        <input
          type="text"
          value={fromAddress}
          onChange={handleFromAddressChange}
          className="ml-3 flex-grow text-slate-700 bg-transparent border-none outline-none"
        />
        {/* Clear button for From Address */}
        {fromAddress && (
          <button
            onClick={clearFromInput}
            className="absolute right-2 text-slate-500 hover:text-slate-700"
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
                  setFromAddress(suggestion.name);
                  setFromStopId(suggestion.extId); // Store extId in Zustand
                  setFromSuggestions([]);
                  onInputChange('from', suggestion.name);
                }}
              >
                {suggestion.name}
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
      <div className="relative flex items-center p-3 border border-slate-300 rounded-md bg-slate-50">
        <div className="flex items-center justify-center w-8 h-8 bg-slate-500 text-white rounded-md font-bold">
          B
        </div>
        <input
          type="text"
          value={toAddress}
          onChange={handleToAddressChange}
          className="ml-3 flex-grow text-slate-700 bg-transparent border-none outline-none"
        />
        {/* Clear button for To Address */}
        {toAddress && (
          <button
            onClick={clearToInput}
            className="absolute right-2 text-slate-500 hover:text-slate-700"
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
                  setToAddress(suggestion.name);
                  setToStopId(suggestion.extId); // Store extId in Zustand
                  setToSuggestions([]);
                  onInputChange('to', suggestion.name);
                }}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TripInput;