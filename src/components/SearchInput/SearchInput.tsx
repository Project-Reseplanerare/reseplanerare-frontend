import search from '../../assets/search.svg';
import close from '../../assets/close.svg';
import { useState } from 'react';

const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

function SearchInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchQuery) => {
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
        const titles = data.data.map((event) => event.title);
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

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  // Clear input and suggestions
  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
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
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
            {suggestions.map((title, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-cyan-100 cursor-pointer"
                onClick={() => {
                  setQuery(title); // Set the clicked suggestion as the input value
                  setSuggestions([]); // Clear suggestions
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
