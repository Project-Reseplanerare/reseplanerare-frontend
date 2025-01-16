import React, { useState } from 'react';

const TravelOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('Buss');

  const options = ['Gång', 'Cykel', 'Buss', 'Tåg'];

  return (
    <div className="flex flex-col items-start gap-4 font-sans">
      <label className="text-sm font-bold">Resealternativ</label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="radio"
              name="travelOption"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="form-radio h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TravelOptions;