import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { fetchAddress } from '../../utils/api/fetchAdress';

const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { setTempCenter, setToLocation, setToAddress } = useLocationStore();

  useEffect(() => {
    const cachedData = localStorage.getItem('eventSuggestions');
    if (!cachedData) {
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${EVENTS_API}?limit=1000`);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      localStorage.setItem(
        'eventSuggestions',
        JSON.stringify(data.data.map((event: { title: string }) => event.title))
      );
    } catch (error) {
      console.error('Error fetching initial event data:', error);
    }
  };

  const fetchSuggestions = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const cachedSuggestions = localStorage.getItem('eventSuggestions');
    if (cachedSuggestions) {
      const filteredSuggestions = JSON.parse(cachedSuggestions).filter(
        (title: string) =>
          title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setQuery(value);
    fetchSuggestions(value);
  };

  const fetchEventCoordinates = async (eventTitle: string) => {
    try {
      const response = await fetch(
        `${EVENTS_API}?search=${eventTitle}&limit=1`
      );
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
          onChange={handleInputChange}
          placeholder="Sök bland tusentals evenemang och besöksmål"
          className="w-full h-10 px-3 bg-transparent text-darkDark dark:text-lightLight placeholder-darkLight dark:placeholder-lightDark placeholder-opacity-50 focus:ring-2 focus:ring-darkLight dark:focus:ring-lightDark focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="px-3 text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
      {query && suggestions.length > 0 && (
        <ul className="w-full border border-darkLight dark:border-lightDark rounded max-h-40 overflow-y-auto bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight shadow-lg">
          {suggestions.map((title, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
              onClick={() => {
                setQuery(title);
                setSuggestions([]);
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
