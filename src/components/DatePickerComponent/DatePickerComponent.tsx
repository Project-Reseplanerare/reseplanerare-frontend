import React, { useState } from "react";

const DatePickerComponent: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("2024-01-20");
  const [endDate, setEndDate] = useState<string>("2024-02-09");
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-start gap-4 font-sans">
      <label className="text-sm font-bold">Ska du vara iväg en längre period?</label>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-500">event</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-500">event</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isRoundTrip}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRoundTrip}
          onChange={() => setIsRoundTrip(!isRoundTrip)}
          className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
        <label className="text-sm">Sök för tur och retur</label>
      </div>
    </div>
  );
};

export default DatePickerComponent;
