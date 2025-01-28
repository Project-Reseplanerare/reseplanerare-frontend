import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaChevronDown } from 'react-icons/fa';

const dateAndTimeOptions = [
  {
    id: 'date',
    label: 'Välj ett datum',
    icon: <FaCalendarAlt className="text-3xl text-blue-600" />,
  },
  {
    id: 'time',
    label: 'Välj en tid',
    icon: <FaClock className="text-3xl text-green-600" />,
  },
];

const DatePickerComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    setIsOpen(false);
  };

  const setCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5);
    setSelectedTime(formattedTime);
  };

  const resetToInitial = () => {
    setSelectedOption(null);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full grid gap-4">
      {/* Dropdown Header */}
      {!selectedOption && (
        <button
          className="flex justify-between items-center w-full cursor-pointer rounded-md transition"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-controls="date-picker-options"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            När planerar du att resa?
          </h2>
          <div className="flex items-center gap-2">
            <FaChevronDown
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      )}

      {/* Dropdown List */}
      {isOpen && (
        <ul
          id="date-picker-options"
          className="grid grid-cols-2 gap-4"
          role="menu"
        >
          {dateAndTimeOptions.map((option) => (
            <li
              key={option.id}
              role="menuitem"
              className="flex flex-col items-center text-center"
            >
              <button
                className="flex flex-col items-center gap-2 p-4 w-full rounded-md bg-gray-50 hover:bg-gray-100 transition focus:ring-2 focus:ring-gray-300"
                onClick={() => handleOptionClick(option.id)}
              >
                {option.icon}
                <span className="text-sm text-gray-700">{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Date Input */}
      {selectedOption === 'date' && (
        <div className="grid gap-2">
          <label
            htmlFor="date-input"
            className="text-sm font-semibold text-gray-700"
          >
            Välj ett datum:
          </label>
          <input
            type="date"
            id="date-input"
            className="p-2 border border-gray-400 rounded"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            className="mt-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={resetToInitial}
          >
            Klart
          </button>
        </div>
      )}

      {/* Time Input */}
      {selectedOption === 'time' && (
        <div className="grid gap-2">
          <label
            htmlFor="time-input"
            className="text-sm font-semibold text-gray-700"
          >
            Välj en tid:
          </label>
          <div className="grid gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={setCurrentTime}
            >
              Använd aktuell tid
            </button>
            <input
              type="time"
              id="time-input"
              className="p-2 border border-gray-400 rounded"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <button
              className="mt-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={resetToInitial}
            >
              Klart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
