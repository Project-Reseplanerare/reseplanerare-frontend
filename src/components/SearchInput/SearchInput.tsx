import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { fetchAddress } from '../../utils/api/fetchAdress';

const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setTempCenter, setToLocation, setToAddress } = useLocationStore();

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${EVENTS_API}?search=${searchQuery}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(
          data.data.map((event: { title: string }) => event.title)
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setQuery(value);

    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  const fetchEventCoordinates = async (eventTitle: string) => {
    try {
      const response = await fetch(
        `${EVENTS_API}?search=${eventTitle}&limit=1`
      );
      if (!response.ok) return;

      const data = await response.json();
      const event = data.data[0];

      if (event?.places?.[0]?.latitude && event?.places?.[0]?.longitude) {
        const { latitude, longitude, name } = event.places[0];
        const latlng: [number, number] = [
          parseFloat(latitude),
          parseFloat(longitude),
        ];

        setTempCenter(latlng);
        setToLocation(latlng);
        setToAddress(name);

        await fetchAddress(
          latitude,
          longitude,
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
      {/* Input Section */}
      <div className="grid grid-cols-[auto,1fr,auto] items-center w-full rounded border border-darkLight dark:border-lightDark backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight">
        {/* Search Icon */}
        <div className="px-3 text-darkLight dark:text-lightDark">
          <FaSearch />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Sök snabbt och enkelt!"
          className="w-full h-10 px-3 bg-transparent text-darkDark dark:text-lightLight placeholder-darkLight dark:placeholder-lightDark focus:ring-2 focus:ring-darkLight dark:focus:ring-lightDark focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearInput}
            className="px-3 text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ✅ Dropdown Suggestions (Hidden when input is empty) */}
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

      {/* ✅ Loading Indicator (Hidden when input is empty) */}
      {query && loading && (
        <p className="text-sm text-darkLight dark:text-lightDark">Loading...</p>
      )}
    </div>
  );
};

export default SearchInput;
