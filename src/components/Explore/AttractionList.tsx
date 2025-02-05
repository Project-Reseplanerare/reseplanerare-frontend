import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBicycle,
  faTicketAlt,
  faLandmark,
  faShoppingBag,
  faUtensils,
  faHotel,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

interface AttractionListProps {
  setSelectedCategory: (category: string) => void;
}

function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = [
    {
      id: 1,
      label: 'Aktiviteter',
      icon: faBicycle,
      subItems: ['Bada', 'Barn & Familj', 'Cykla', 'Fiska', 'Golfa', 'Sport'],
    },
    {
      id: 2,
      label: 'Evenemang',
      icon: faTicketAlt,
      subItems: ['Barn', 'Dans', 'Musik', 'Sport', 'Teater'],
    },
    {
      id: 3,
      label: 'Kultur & historia',
      icon: faLandmark,
      subItems: ['Konst', 'Museum', 'Kyrka', 'Parker'],
    },
    {
      id: 4,
      label: 'Design & shopping',
      icon: faShoppingBag,
      subItems: ['Antikt', 'Gårdsbutik', 'Shopping'],
    },
    {
      id: 5,
      label: 'Mat & dryck',
      icon: faUtensils,
      subItems: ['Restaurang', 'Kafé', 'Pub'],
    },
    {
      id: 6,
      label: 'Boende',
      icon: faHotel,
      subItems: ['Hotell', 'Stugor', 'Vandrarhem'],
    },
  ];

  const handleItemClick = (id: number, label: string) => {
    setActiveIndex(activeIndex === id ? null : id);
    setSelectedCategory(label);
  };

  return (
    <div className="space-y-4">
      {' '}
      {/* Ensures consistent spacing between items */}
      {items.map((item) => (
        <div key={item.id} className="w-full">
          <div
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 rounded-md border cursor-pointer transition 
          bg-lightDark text-darkDark border-darkDark dark:bg-darkDark dark:text-lightDark dark:border-lightDark
          ${
            activeIndex === item.id
              ? 'bg-darkDark text-lightDark border-lightDark dark:bg-lightDark dark:text-darkDark dark:border-darkDark'
              : ''
          }`}
            onClick={() => handleItemClick(item.id, item.label)}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="w-6 h-6 text-darkLight dark:text-lightDark"
            />
            <span className="text-sm">{item.label}</span>
            <FontAwesomeIcon
              icon={activeIndex === item.id ? faChevronUp : faChevronDown}
              className="w-4 h-4 text-darkLight dark:text-lightDark transition-transform"
            />
          </div>

          <div className="grid gap-2 mt-2">
            {activeIndex === item.id && item.subItems ? (
              item.subItems.map((subItem, index) => (
                <div
                  key={index}
                  className="p-4 bg-lightDark text-darkDark border border-darkDark dark:bg-darkDark dark:text-lightDark dark:border-lightDark rounded-md cursor-pointer transition hover:bg-darkDark dark:hover:bg-lightDark hover:text-lightDark dark:hover:text-darkDark hover:border-lightDark dark:hover:border-darkDark"
                >
                  {subItem}
                </div>
              ))
            ) : (
              <div className="h-0" /> // Maintains consistent spacing
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AttractionList;
