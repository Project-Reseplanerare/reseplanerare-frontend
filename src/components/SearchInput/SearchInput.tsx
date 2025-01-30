import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLocationStore } from '../../store/useLocationStore';

const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

// TODO: Vid klick på ett event, hämta koordinaterna (latitude och longitude) från eventets platsdata.
// TODO: Kontrollera att koordinaterna är tillgängliga och giltiga innan de används.
// TODO: Om koordinaterna är giltiga, lagra dem i en array.
// TODO: Skicka den skapade arrayen med koordinater till funktionen setToLocation i ../../store/useLocationStore.
// TODO: Hantera eventuella fel, exempelvis om koordinaterna saknas eller om API-anropet misslyckas.

function SearchInput() {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setTempCenter } = useLocationStore();

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
    setQuery((prev) => (prev ? '' : prev));
    setSuggestions((prev) => (prev.length ? [] : prev));
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
          const { latitude, longitude } = place;

          console.log('Event Coordinates:', { latitude, longitude });

          const latlng: [number, number] = [
            parseFloat(latitude),
            parseFloat(longitude),
          ];
          setTempCenter(latlng);
        } else {
          console.error('Coordinates not found for the event.');
        }
      }
    } catch (error) {
      console.error('Error fetching event coordinates:', error);
    }
  };

  return (
    <div className="w-full grid gap-4 bg-white text-gray-900 border border-gray-300 p-6 mt-6 rounded-md  text-center">
      {/* Intro Text */}
      <div className="grid gap-1">
        <p className="text-sm text-gray-600 font-normal">
          Vet du vad du vill upptäcka, men inte var det finns?
        </p>
        <p className="text-sm text-gray-600 font-normal">
          Sök här och hitta det snabbt!
        </p>
      </div>

      {/* Input Section */}
      <div className="relative grid grid-cols-[auto,1fr,auto] items-center w-full max-w-md mx-auto border border-gray-300 rounded-md bg-gray-50">
        <div className="px-3 text-gray-500">
          <FaSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Ange plats eller stad"
          className="h-10 w-full text-sm font-normal text-gray-900 placeholder-gray-400 px-3 bg-gray-50 focus:ring-1 focus:ring-gray-500 focus:outline-none"
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
}

export default SearchInput;
