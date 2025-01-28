import { useState } from 'react';
import { FaTrain, FaBus, FaCar, FaChevronDown } from 'react-icons/fa';

function TravelOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<string | null>('car'); // Default to 'car'

  const travelOptions = [
    {
      id: 'train',
      label: 'Tåg',
      icon: <FaTrain className="text-3xl text-slate-700" />,
    },
    {
      id: 'bus',
      label: 'Buss',
      icon: <FaBus className="text-3xl text-slate-700" />,
    },
    {
      id: 'car',
      label: 'Bil',
      icon: <FaCar className="text-3xl text-slate-700" />,
    },
  ];

  const handleItemClick = (id: string) => {
    setActiveIndex(id);
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4 w-full">
      <button
        className="flex justify-between items-center w-full cursor-pointer rounded-md transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h2 className="text-lg font-semibold text-slate-800">
          Hur planerar du att resa?
        </h2>
        <div className="flex items-center gap-2">
          <FaChevronDown
            className={`w-5 h-5 text-slate-600 transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {travelOptions.map((option) => (
            <div
              key={option.id}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-md cursor-pointer transition ${
                activeIndex === option.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-50 text-slate-700'
              }`}
              onClick={() => handleItemClick(option.id)}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TravelOptions;
