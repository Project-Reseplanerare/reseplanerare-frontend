import search from '../../assets/search.svg';
import close from '../../assets/close.svg';
import { useState } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import { data } from 'react-router-dom';

// TODO: jag vi ha coordinaterna från klickat event in i en array som passeras till setToLocation store ../../store/useLocationStore



const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

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
          const response = await fetch(`${EVENTS_API}?search=${searchQuery}&limit=10`);
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
      fetchSuggestions(value);
  };

  const clearInput = () => {
      setQuery('');
      setSuggestions([]);
  };

  const fetchEventCoordinates = async (eventTitle: string) => {
    try {
        const response = await fetch(`${EVENTS_API}?search=${eventTitle}&limit=1`);
        if (response.ok) {
            const data = await response.json();
            const event = data.data[0];

            const place = event.places && event.places[0];
            if (place && place.latitude && place.longitude) {
                const { latitude, longitude } = place;

                console.log('Event Coordinates:', { latitude, longitude });

                
                const latlng: [number, number] = [parseFloat(latitude), parseFloat(longitude)];
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
      <div className="w-full grid gap-4 bg-white border border-gray-300 p-4 mt-6 rounded-md text-center">
          {/* Intro Text */}
          <div className="grid gap-1">
              <p className="text-sm text-gray-700 font-normal">
                  Vet du vad du vill upptäcka, men inte var det finns?
              </p>
              <p className="text-sm text-gray-700 font-normal">
                  Sök här och hitta det snabbt!
              </p>
          </div>

          {/* Input Section */}
          <div className="relative flex items-center justify-center w-full max-w-md mx-auto border border-cyan-600 rounded-md">
              <div className="flex items-center justify-center px-3">
                  <img src={search} alt="Search" className="w-5 h-5 text-gray-500" />
              </div>
              <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Ange plats eller stad"
                  className="flex-1 h-10 text-sm font-normal text-black placeholder-gray-500 px-3 focus:ring-1 focus:ring-cyan-700 focus:outline-none"
              />
              <button
                  onClick={clearInput}
                  className="flex items-center justify-center px-3"
              >
                  <img src={close} alt="Close" className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Suggestions */}
              {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-50">
                      {suggestions.map((title, index) => (
                          <li
                              key={index}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-cyan-100 cursor-pointer"
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