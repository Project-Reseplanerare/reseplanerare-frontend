import React from 'react';

const TripInput: React.FC = () => {
  const [from, setFrom] = React.useState('Nolbygatan 654 62 Karlstad');
  const [to, setTo] = React.useState('Sundsta-Norrstrand Karlstad');

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex flex-col items-center gap-4 font-sans">
      <label className="text-sm font-bold">Från</label>
      <div className="w-full">
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={swapLocations}
      >
        ⟲
      </button>

      <label className="text-sm font-bold">Till</label>
      <div className="w-full">
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default TripInput;
