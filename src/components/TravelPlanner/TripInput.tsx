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

  const [suggestions, setSuggestions] = useState<{ from: any[]; to: any[] }>({
    from: [],
    to: [],
  });

  const fetchStops = async (type: 'from' | 'to', value: string) => {
    if (!value.trim()) {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      return;
    }
  
    if (!selectedOption || selectedOption === "Bil") {
      console.warn("No selected travel option. Fetching skipped.");
      return;
    }
  
    const fetchFunction =
      selectedOption === 'Buss' ? fetchBusStops : fetchTrainStops;
  
    const stops = await fetchFunction(value);
  
    setSuggestions((prev) => ({
      ...prev,
      [type]: stops.map((stop: { name: string; extId: string }) => ({
        name: stop.name,
        extId: stop.extId,
      })),
    }));
  };
  

  const handleInputChange = async (
    type: 'from' | 'to',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (type === 'from') {
      setFromAddress(value);
    } else {
      setToAddress(value);
    }
    onInputChange(type, value);
    fetchStops(type, value);
  };

  const clearInput = (type: 'from' | 'to') => {
    if (type === 'from') {
      setFromAddress('');
      setFromStopId('');
    } else {
      setToAddress('');
      setToStopId('');
    }
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
  };

  const swapAddresses = () => {
    setFromAddress(toAddress);
    setToAddress(fromAddress);
    setFromStopId(toStopId);
    setToStopId(fromStopId);
  };

  useEffect(() => {
    console.log('Updated fromStopId:', fromStopId);
    console.log('Updated toStopId:', toStopId);
  }, [fromStopId, toStopId]);

  const renderInputField = (type: 'from' | 'to', label: string) => {
    const address = type === 'from' ? fromAddress : toAddress;
    const borderColor = address ? 'border-blueLight dark:border-blueDark' : '';

    return (
      <div className="relative">
        <div
          className={`grid grid-cols-[min-content_1fr_min-content] border border-lightBorder dark:border-lightLight rounded-md bg-lightLight dark:bg-darkDark p-2 items-center gap-2 ${borderColor}`}
        >
          <div
            className={`w-6 h-6 flex items-center justify-center text-lightLight dark:text-darkDark rounded-md font-bold ${
              address
                ? 'bg-blueLight dark:bg-blueLight dark:text-lightLight'
                : 'bg-darkLight dark:bg-lightDark'
            }`}
          >
            {label}
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => handleInputChange(type, e)}
            className="w-full text-darkDark dark:text-lightLight bg-transparent border-none outline-none"
          />
          {address && (
            <button
              onClick={() => clearInput(type)}
              className="text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {suggestions[type].length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-lightLight dark:bg-darkDark border border-darkLight dark:border-lightDark rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {suggestions[type].map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-darkDark dark:text-lightLight hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
                onClick={() => {
                  if (type === 'from') {
                    setFromAddress(suggestion.name);
                    setFromStopId(suggestion.extId);
                  } else {
                    setToAddress(suggestion.name);
                    setToStopId(suggestion.extId);
                  }
                  setSuggestions((prev) => ({ ...prev, [type]: [] }));
                  onInputChange(type, suggestion.name);
                }}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      <h4 className="font-bold text-xl text-darkDark dark:text-lightLight">
        Vart vill du resa?
      </h4>

      <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-center rounded-lg">
        {renderInputField('from', 'A')}
        <div className="row-span-2 self-center ml-1">
          <SwapBtn
            isDisabled={!fromAddress || !toAddress}
            onClick={swapAddresses}
          />
        </div>
        {renderInputField('to', 'B')}
      </div>
    </>
  );
};

export default TripInput;
