import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../../utils/api/fetchCategories';
import { fetchEvents } from '../../utils/api/fetchEvents';

import cultureIcon from '../../assets/culture.svg';
import foodIcon from '../../assets/food.svg';
import houseIcon from '../../assets/house.svg';
import shoppingIcon from '../../assets/shopping.svg';
import sportCurlingIcon from '../../assets/sport-curling.svg';
import ticketIcon from '../../assets/ticket.svg';

interface AttractionListProps {
  setSelectedCategory: (places: any[]) => void;
}

type IconCategory =
  | 'Kultur & historia'
  | 'Mat & dryck'
  | 'Boende'
  | 'Design & shopping'
  | 'Aktiviteter'
  | 'Evenemang';

const iconMapping: Record<IconCategory, string> = {
  'Kultur & historia': cultureIcon,
  'Mat & dryck': foodIcon,
  'Boende': houseIcon,
  'Design & shopping': shoppingIcon,
  'Aktiviteter': sportCurlingIcon,
  'Evenemang': ticketIcon,
};

function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]); // State for events
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true); // Loading state for categories
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true); // Loading state for events
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false); // Categories are loaded
      })
      .catch(() => {
        setLoadingCategories(false); // Handle errors by setting loading to false
      });

    // Fetch events
    fetchEvents(10, 50, 1, setLoadingEvents, setEvents); // Justera enligt behov
  }, []);

  const handleItemClick = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const handleSubItemClick = async (subItem: string) => {
    try {
      if (subItem === 'Evenemang') {
        setSelectedCategory(events);
        setSelectedSubItem(subItem);
      } else {
        const response = await fetch(
          `https://turid.visitvarmland.com/api/v8/products?categories=${subItem.toLowerCase()}`
        );
        const data = await response.json();
        const products = Array.isArray(data.data) ? data.data : [];
        const filteredProducts = products.filter((product: any) =>
          product.categories.some((category: any) => category.title === subItem)
        );
        const allPlaces = filteredProducts.flatMap((product: any) => product.places || []);
        setSelectedCategory(allPlaces);
        setSelectedSubItem(subItem);
      }
    } catch (error) {
      console.error('Fel vid hämtning av platser:', error);
    }
  };

  // Render only when both categories and events are loaded
  if (loadingCategories || loadingEvents) {
    return null; // Don't render anything if data is still loading
  }

  return (
    <div className="grid gap-2">
      {categories.map((category) => {
        const isActive = activeIndex === category.id;

        return (
          <div key={category.id} className="w-full">
            {/* Category Item */}
            <div
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border border-lightlightBorder dark:border-lightlight 
              ${
                isActive
                  ? 'bg-[#D3D3D3] bg-opacity-80 text-darkDark border border-lightlightBorder dark:bg-white dark:bg-opacity-100 dark:text-darkDark dark:border-[#444]'
                  : 'bg-white bg-opacity-100 text-darkDark border-lightlightBorder dark:border-lightlight dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark '
              }`}
              onClick={() => handleItemClick(category.id)}
            >
              <img
                src={iconMapping[category.label as IconCategory] || cultureIcon}
                alt={`${category.label} ikon`}
                className="w-5 h-5"
              />
              <span>{category.label}</span>
              <FontAwesomeIcon
                icon={isActive ? faChevronUp : faChevronDown}
                className="transition-transform"
              />
            </div>

            {/* Sub-items */}
            {isActive && category.subItems.length > 0 && (
              <div className="grid gap-2">
                {category.subItems.map((subItem: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border border-lightlightBorder dark:border-lightlight cursor-pointer transition-all
                    ${
                      selectedSubItem === subItem
                        ? 'bg-[#D3D3D3] bg-opacity-80 text-darkDark border border-lightlightBorder dark:bg-white dark:bg-opacity-100 dark:text-darkDark dark:border-[#444]'
                        : 'bg-white bg-opacity-100 text-darkDark border-lightlightBorder dark:border-lightlight dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark '
                    }`}
                    onClick={() => handleSubItemClick(subItem)}
                  >
                    <span className="text-xs">{subItem}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Evenemang (Events) */}
      <div className="w-full">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border border-lightlightBorder dark:border-lightlight 
          ${
            activeIndex === -1
              ? 'bg-[#D3D3D3] bg-opacity-80 text-darkDark border border-lightlightBorder dark:bg-white dark:bg-opacity-100 dark:text-darkDark dark:border-[#444]'
              : 'bg-white bg-opacity-100 text-darkDark border-lightlightBorder dark:border-lightlight dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark '
          }`}
          onClick={() => setActiveIndex(activeIndex === -1 ? null : -1)} // Toggle evenemang visibility
        >
          <img
            src={ticketIcon}
            alt="Evenemang ikon"
            className="w-5 h-5"
          />
          <span>Evenemang</span>
          <FontAwesomeIcon
            icon={activeIndex === -1 ? faChevronUp : faChevronDown}
            className="transition-transform"
          />
        </div>

        {/* Show events */}
        {activeIndex === -1 && events.length > 0 && (
          <div className="grid gap-2">
            {events.map((event, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border border-lightlightBorder dark:border-lightlight cursor-pointer transition-all
                  ${
                    selectedSubItem === event.title
                      ? 'bg-[#D3D3D3] bg-opacity-80 text-darkDark border border-lightlightBorder dark:bg-white dark:bg-opacity-100 dark:text-darkDark dark:border-[#444]'
                      : 'bg-white bg-opacity-100 text-darkDark border-lightlightBorder dark:border-lightlight dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark '
                  }`}
                onClick={() => {
                  setSelectedCategory([event]);
                  setSelectedSubItem(event.title);
                }}
              >
                <span className="text-xs">{event.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttractionList;
