import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { fetchBusStops } from '../../utils/api/fetchBusStopsVarm';
import { fetchTrainStops } from '../../utils/api/fetchTrainStopsVarm';
import { SwapBtn } from './swapBtn';
import TripInputProps from '../../interfaces/travelPlannerInterfaces/tripInput_interfaces';

export const TripInput: React.FC<TripInputProps> = ({ onInputChange }) => {
  const { fromAddress, toAddress, setFromAddress, setToAddress } =
    useLocationStore();
  const { selectedOption } = useTravelOptionsStore();
  const { setFromStopId, setToStopId, fromStopId, toStopId } =
    useRouteStopStore();

  const [suggestions, setSuggestions] = useState<{ from: any[]; to: any[] }>({
    from: [],
    to: [],
  });
  const [activeDropdown, setActiveDropdown] = useState<'from' | 'to' | null>(
    null
  );

  const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  const fetchStops = async (type: 'from' | 'to', value: string) => {
    if (!value.trim()) {
      setSuggestions({ from: [], to: [] });
      return;
    }

    if (!selectedOption || selectedOption === 'Bil') {
      console.warn('No selected travel option. Fetching skipped.');
      return;
    }

    const fetchFunction =
      selectedOption === 'Buss' ? fetchBusStops : fetchTrainStops;
    const stops = await fetchFunction(value);

    setSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [type]: stops.map((stop) => ({ name: stop.name, extId: stop.extId })),
    }));

    setActiveDropdown(type);
  };

  const debouncedFetchStops = debounce(fetchStops, 300);

  const handleInputChange = (
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
    debouncedFetchStops(type, value);
  };

  const clearInput = (type: 'from' | 'to') => {
    if (type === 'from') {
      setFromAddress('');
      setFromStopId('');
    } else {
      setToAddress('');
      setToStopId('');
    }
    setSuggestions({ from: [], to: [] });
    setActiveDropdown(null);
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
      <div className="grid gap-1">
        <div
          className={`grid grid-cols-[min-content_1fr_min-content] border border-lightlightBorder dark:border-lightlight rounded-md backdrop-blur-md bg-white light dark:bg-darkDark/90 p-2 items-center gap-2 ${borderColor}`}
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
            onFocus={() => setActiveDropdown(type)}
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

        {activeDropdown === type && suggestions[type].length > 0 && (
          <ul className="bg-lightLight dark:bg-darkDark border border-lightlightBorder dark:border-lightlight rounded-md ">
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
                  setSuggestions({ from: [], to: [] });
                  setActiveDropdown(null);
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

      <div className="grid grid-cols-[1fr_min-content] gap-4 w-full items-start rounded-lg">
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
