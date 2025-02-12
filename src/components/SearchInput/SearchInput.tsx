import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';
import { fetchAddress } from '../../utils/api/fetchAdress';

const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

const SearchInput = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setTempCenter, setToLocation, setToAddress } = useLocationStore();

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery) {
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
        const titles = data.data.map((event: { title: string }) => event.title);
        setSuggestions(titles);
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
    const value = e.target.value;

    setQuery(value);

    if (value.trim()) {
      fetchSuggestions(value);
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
      if (response.ok) {
        const data = await response.json();
        const event = data.data[0];

        const place = event.places && event.places[0];
        if (place && place.latitude && place.longitude) {
          const { latitude, longitude, name } = place;

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
      }
    } catch (error) {
      console.error('Error fetching event coordinates:', error);
    }
  };

  return (
    <div className="items-center grid gap-4 shadow-md ">
      {/* Input Section */}
      <div className="relative grid grid-cols-[auto,1fr,auto] items-center w-full rounded border-darkLight dark:border-lightDark backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight">
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
          className="h-10 w-full text-darkDark dark:text-lightLight placeholder-darkLight dark:placeholder-lightDark px-3 bg-transparent focus:ring-2 focus:ring-darkLight dark:focus:ring-lightDark focus:outline-none text-left"
        />

        {query && (
          <button
            onClick={clearInput}
            className="px-3 text-darkLight dark:text-lightDark hover:text-darkDark dark:hover:text-lightLight transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full  border border-darkLight dark:border-lightDark rounded max-h-40 overflow-y-auto z-50 mt-2 bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight">
            {suggestions.map((title, index) => (
              <li
                key={index}
                className="px-4 py-2 text-darkDark dark:text-lightLight hover:bg-lightDark dark:hover:bg-darkLight cursor-pointer transition"
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

        {loading && (
          <p className="absolute top-full left-0 text-sm text-darkLight dark:text-lightDark px-4 py-2">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
