import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { useBusStopStore } from '../../store/useBusStopStore';
import { fetchStops } from '../../utils/api/fetchBusStopsVarm';
import { fetchTrainStops } from '../../utils/api/fetchTrainStopsVarm';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const { fromAddress, toAddress, setFromAddress, setToAddress } =
    useLocationStore();
  const { selectedOption } = useTravelOptionsStore();
  const { setFromStopId, setToStopId, fromStopId, toStopId } =
    useBusStopStore();

  const [fromSuggestions, setFromSuggestions] = useState<
    { name: string; extId: string }[]
  >([]);
  const [toSuggestions, setToSuggestions] = useState<
    { name: string; extId: string }[]
  >([]);

  const handleFromAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAddress(value);
    onInputChange('from', value);

    if (value.trim()) {
      if (selectedOption === 'Buss') {
        // Fetch bus stops if option is "Buss"
        const stops = await fetchStops(value);
        setFromSuggestions(
          stops.map((stop: { name: any; extId: any }) => ({
            name: stop.name,
            extId: stop.extId,
          }))
        );
      } else if (selectedOption === 'Tåg') {
        // Fetch train stops if option is "Tåg"
        const trainStops = await fetchTrainStops(value);
        setFromSuggestions(
          trainStops.map((stop: { name: any; extId: any }) => ({
            name: stop.name,
            extId: stop.extId,
          }))
        );
      } else {
        setFromSuggestions([]);
      }
    } else {
      setFromSuggestions([]);
    }
  };


  const handleToAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAddress(value);
    onInputChange('to', value);

    if (value.trim()) {
      if (selectedOption === 'Buss') {
        // Fetch bus stops if option is "Buss"
        const stops = await fetchStops(value);
        setToSuggestions(
          stops.map((stop: { name: any; extId: any }) => ({
            name: stop.name,
            extId: stop.extId,
          }))
        );
      } else if (selectedOption === 'Tåg') {
        // Fetch train stops if option is "Tåg"
        const trainStops = await fetchTrainStops(value);
        setToSuggestions(
          trainStops.map((stop: { name: any; extId: any }) => ({
            name: stop.name,
            extId: stop.extId,
          }))
        );
      } else {
        setToSuggestions([]);
      }
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
    console.log('Updated fromStopId:', fromStopId);
    console.log('Updated toStopId:', toStopId);
  }, [fromStopId, toStopId]);

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-center rounded-lg p-4">
      {/* From Address Input */}
      <div className="relative">
        {/* Strict 3-Column Grid Layout */}
        <div className="grid grid-cols-[min-content_1fr_min-content] border border-darkLight dark:border-lightDark rounded-md bg-lightLight dark:bg-darkDark p-3 items-center gap-2">
          {/* Column 1: Icon */}
          <div>
            <div className="w-8 h-8 flex items-center justify-center bg-darkLight dark:bg-lightDark text-lightLight dark:text-darkDark rounded-md font-bold">
              A
            </div>
          </div>

          {/* Column 2: Input Field (Expands to Fill Space) */}
          <div>
            <input
              type="text"
              value={fromAddress}
              onChange={handleFromAddressChange}
              className="w-full text-darkDark dark:text-lightLight bg-transparent border-none outline-none"
            />
          </div>

          {/* Column 3: Clear Button (Min-Width) */}
          <div>
            {fromAddress && (
              <button
                onClick={clearFromInput}
                className="text-darkLight dark:text-lightDark hover:text-darkDark  dark:hover:text-lightLight"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* From Address Suggestions Dropdown (Separate from Grid) */}
        {fromSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-lightLight dark:bg-darkDark border border-darkLight dark:border-lightDark rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {fromSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-darkDark dark:text-lightLight hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
                onClick={() => {
                  setFromAddress(suggestion.name);
                  setFromStopId(suggestion.extId);
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
        className={`flex items-center justify-center rounded-full h-12 w-12 border focus:outline-none transition
      ${
        isSwapDisabled
          ? 'bg-darkLight dark:bg-lightDark text-lightDark dark:text-darkLight border-darkLight dark:border-lightDark cursor-not-allowed opacity-50'
          : 'bg-lightLight dark:bg-darkDark text-darkDark dark:text-lightLight border-darkLight dark:border-lightDark hover:bg-lightDark dark:hover:bg-darkLight'
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
      <div className="relative">
        {/* Strict 3-Column Grid Layout */}
        <div className="grid grid-cols-[min-content_1fr_min-content] border border-darkLight dark:border-lightDark rounded-md bg-lightLight dark:bg-darkDark p-3 items-center gap-2">
          {/* Column 1: Icon */}
          <div>
            <div className="w-8 h-8 flex items-center justify-center bg-darkLight dark:bg-lightDark text-lightLight dark:text-darkDark rounded-md font-bold">
              B
            </div>
          </div>

          {/* Column 2: Input Field (Expands to Fill Space) */}
          <div>
            <input
              type="text"
              value={toAddress}
              onChange={handleToAddressChange}
              className="w-full text-darkDark dark:text-lightLight bg-transparent border-none outline-none"
            />
          </div>

          {/* Column 3: Clear Button (Min-Width) */}
          <div>
            {toAddress && (
              <button
                onClick={clearToInput}
                className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* To Address Suggestions Dropdown (Separate from Grid) */}
        {toSuggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-lightLight dark:bg-darkDark border border-darkLight dark:border-lightDark rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {toSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-darkDark dark:text-lightLight hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
                onClick={() => {
                  setToAddress(suggestion.name);
                  setToStopId(suggestion.extId);
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
