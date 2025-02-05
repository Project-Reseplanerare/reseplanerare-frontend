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

    setQuery((prev) => (prev !== value ? value : prev));

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

          console.log('Event Coordinates:', { latitude, longitude, name });

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
    <div className="w-full grid gap-4 bg-white py-6 text-gray-900 text-center">
      {/* Input Section */}
      <div className="relative grid grid-cols-[auto,1fr,auto] items-center w-full border border-gray-300 rounded-lg bg-white">
        {/* Search Icon */}
        <div className="px-3 text-gray-500">
          <FaSearch />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Vet du vad du söker men inte var? Hitta det snabbt här!"
          className="h-10 w-full text-sm text-gray-900 placeholder-gray-400 px-3 bg-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />

        {query && (
          <button
            onClick={clearInput}
            className="px-3 text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-50 mt-1">
            {suggestions.map((title, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition"
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
          <p className="absolute top-full left-0 text-sm text-gray-500 px-4 py-2">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
