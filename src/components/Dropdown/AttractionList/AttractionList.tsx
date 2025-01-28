import { useState } from 'react';
import {
  FaHiking,
  FaLandmark,
  FaUtensils,
  FaHotel,
  FaShoppingBag,
  FaCalendarAlt,
  FaChevronDown,
} from 'react-icons/fa';

function AttractionList() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(3); // Default to "Mat och dryck"

  const items = [
    {
      id: 1,
      label: 'Aktiviteter',
      icon: <FaHiking className="text-3xl text-slate-700" />,
    },
    {
      id: 2,
      label: 'Kultur och historia',
      icon: <FaLandmark className="text-3xl text-slate-700" />,
    },
    {
      id: 3,
      label: 'Mat och dryck',
      icon: <FaUtensils className="text-3xl text-slate-700" />,
    },
    {
      id: 4,
      label: 'Boende',
      icon: <FaHotel className="text-3xl text-slate-700" />,
    },
    {
      id: 5,
      label: 'Design och shopping',
      icon: <FaShoppingBag className="text-3xl text-slate-700" />,
    },
    {
      id: 6,
      label: 'Evenemang',
      icon: <FaCalendarAlt className="text-3xl text-slate-700" />,
    },
  ];

  const handleItemClick = (id: number) => {
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
          Se och göra i Värmland
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-4 rounded-md cursor-pointer transition ${
                activeIndex === item.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-50 text-slate-700'
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttractionList;
