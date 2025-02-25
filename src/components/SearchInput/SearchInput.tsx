import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { fetchAddress } from '../../utils/api/fetchAdress';

// events API endpoint
const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectionMade, setSelectionMade] = useState(false);
  const { setTempCenter, setToLocation, setToAddress } = useLocationStore();

  useEffect(() => {
    if (query.trim() && !selectionMade) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query, selectionMade]);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`${EVENTS_API}?search=${searchQuery}&limit=1000`);
      if (!response.ok) {
        throw new Error('Failed to fetch event suggestions');
      }
      const data = await response.json();
      const filteredSuggestions = data.data
        .map((event: { title: string }) => event.title)
        .filter((title) =>
          title.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchEventCoordinates = async (eventTitle: string) => {
    try {
      const response = await fetch(`${EVENTS_API}?search=${eventTitle}&limit=1`);
      if (!response.ok) {
        throw new Error('Failed to fetch event coordinates');
      }
      const data = await response.json();
      const event = data.data?.[0]?.places?.[0];

      if (event?.latitude && event?.longitude) {
        const latlng: [number, number] = [
          parseFloat(event.latitude),
          parseFloat(event.longitude),
        ];
        setTempCenter(latlng);
        setToLocation(latlng);
        setToAddress(event.name);
        await fetchAddress(
          event.latitude,
          event.longitude,
          'to',
          setToAddress,
          setToAddress
        );
      } else {
        console.error('Coordinates not found for the event.');
      }
    } catch (error) {
      console.error('Error fetching event coordinates:', error);
    }
  };

  return (
    <div className="grid gap-2 w-full shadow-md">
      <div className="grid grid-cols-[auto,1fr,auto] items-center w-full rounded border-darkLight dark:border-lightDark backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight">
        <div className="px-3 text-darkLight dark:text-lightDark">
          <FaSearch />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.trimStart());
            setSelectionMade(false); // Clear selection when user manually types
          }}
          placeholder="Sök bland tusentals evenemang och besöksmål"
          className="w-full h-10 px-3 bg-transparent text-darkDark dark:text-lightLight placeholder-darkLight dark:placeholder-lightDark placeholder-opacity-50 border focus:border-blueLight focus:ring-0 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setSelectionMade(false);
            }}
            className="px-3 text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {query && suggestions.length > 0 && (
        <ul className="w-full border rounded max-h-40 overflow-y-auto backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight shadow-lg">
          {suggestions.map((title, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
              onClick={() => {
                setQuery(title);
                setSuggestions([]);
                setSelectionMade(true); 
                fetchEventCoordinates(title);
              }}
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
