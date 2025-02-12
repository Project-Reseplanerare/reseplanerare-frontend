import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { fetchBusStops } from '../../utils/api/fetchBusStopsVarm';
import { fetchTrainStops } from '../../utils/api/fetchTrainStopsVarm';
import SwapBtn from './swapBtn';

interface TripInputProps {
  onInputChange: (inputType: 'from' | 'to', value: string) => void;
}

const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const { fromAddress, toAddress, setFromAddress, setToAddress } =
    useLocationStore();
  const { selectedOption } = useTravelOptionsStore();
  const { setFromStopId, setToStopId, fromStopId, toStopId } =
    useRouteStopStore();

  const [fromSuggestions, setFromSuggestions] = useState<
    { name: string; extId: string }[]
  >([]);
  const [toSuggestions, setToSuggestions] = useState<
    { name: string; extId: string }[]
  >([]);

  const handleFromAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFromAddress(value);
    onInputChange('from', value);

    if (value.trim()) {
      if (selectedOption === 'Buss') {
        // Fetch bus stops if option is "Buss"
        const stops = await fetchBusStops(value);
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

  const handleToAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setToAddress(value);
    onInputChange('to', value);

    if (value.trim()) {
      if (selectedOption === 'Buss') {
        // Fetch bus stops if option is "Buss"
        const stops = await fetchBusStops(value);
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
    <>
      <h4 className=" font-bold text-xl text-darkDark dark:text-lightLight">
        Vart vill du resa?
      </h4>

      <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-center rounded-lg ">
        {/* From Address Input */}
        <div className="relative">
          {/* Strict 3-Column Grid Layout */}
          <div
            className={`grid grid-cols-[min-content_1fr_min-content] border border-lightBorder dark:border-lightLight rounded-md bg-lightLight dark:bg-darkDark p-2 items-center gap-2 ${
              fromAddress ? 'border-blueLight dark:border-blueDark' : ''
            }`}
          >
            {/* Column 1: Icon */}
            <div>
              <div
                className={`w-6 h-6 flex items-center justify-center text-lightLight dark:text-darkDark rounded-md font-bold ${
                  fromAddress
                    ? 'bg-blueLight dark:bg-blueLight dark:text-lightLight'
                    : 'bg-darkLight dark:bg-lightDark'
                }`}
              >
                A
              </div>
            </div>

            {/* Column 2: Input Field (Expands to Fill Space) */}
            <div>
              <input
                type="text"
                value={fromAddress}
                onChange={handleFromAddressChange}
                className="w-full text-darkDark dark:text-lightLight bg-transparent border-none outline-none" // här minskar vi padding och textstorlek
              />
            </div>

            {/* Column 3: Clear Button (Min-Width) */}
            <div>
              {fromAddress && (
                <button
                  onClick={clearFromInput}
                  className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* From Address Suggestions Dropdown */}
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

        {/* Swap Button - ny komponent*/}
        <div className="row-span-2 self-center ml-1">
          <SwapBtn isDisabled={isSwapDisabled} onClick={swapAddresses} />
        </div>

        {/* To Address Input */}
        <div className="relative">
          {/* Strict 3-Column Grid Layout */}
          <div
            className={`grid grid-cols-[min-content_1fr_min-content] border border-lightBorder dark:border-lightLight rounded-md bg-lightLight dark:bg-darkDark p-2 items-center gap-2 ${
              toAddress ? 'border-blueLight dark:border-blueDark' : ''
            }`}
          >
            {/* Column 1: Icon */}
            <div>
              <div
                className={`w-6 h-6 flex items-center justify-center text-lightLight dark:text-darkDark rounded-md font-bold ${
                  toAddress
                    ? 'bg-blueLight dark:bg-blueLight dark:text-lightLight'
                    : 'bg-darkLight dark:bg-lightLight'
                }`}
              >
                B
              </div>
            </div>

            {/* Column 2: Input Field (Expands to Fill Space) */}
            <div>
              <input
                type="text"
                value={toAddress}
                onChange={handleToAddressChange}
                className="w-full text-darkDark dark:text-lightLight bg-transparent border-none outline-none" // här minskar vi padding och textstorlek
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

          {/* To Address Suggestions Dropdown */}
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
    </>
  );
};

export default TripInput;
