import React from 'react';

const TripInput: React.FC = () => {
  const [from, setFrom] = React.useState('Nolbygatan 654 62 Karlstad');
  const [to, setTo] = React.useState('Sundsta-Norrstrand Karlstad');

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full items-center rounded-lg p-4 ">
      {/* From Input */}
      <div className="col-span-2 row-span-1 flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
        <div className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-md font-bold">
          A
        </div>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="ml-3 flex-grow text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
          placeholder="Enter starting location"
        />
      </div>

      {/* Swap Button */}
      <button
        className="col-span-1 row-span-2 flex items-center justify-center bg-white rounded-full h-12 w-12 border border-gray-300 shadow-md focus:outline-none hover:bg-gray-100"
        onClick={swapLocations}
        aria-label="Swap locations"
        title="Swap locations"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v6h6M20 20v-6h-6M4 10l7-7m0 0l7 7M4 14l7 7m0 0l7-7"
          />
        </svg>
      </button>

      {/* To Input */}
      <div className="col-span-2 row-span-1 flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
        <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-md font-bold">
          B
        </div>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="ml-3 flex-grow text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
          placeholder="Enter destination"
        />
      </div>
    </div>
  );
};

export default TripInput;
