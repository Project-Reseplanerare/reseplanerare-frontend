import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../../utils/api/fetchCategories';
import { fetchEvents } from '../../utils/api/fetchEventsAndProducts';

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

// Funktion för att säkerställa rätt koordinater
const normalizeCoordinates = (lat: any, lng: any) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  // Returnera en objekt med lat, lng, och kollar om de är NaN
  return isNaN(parsedLat) || isNaN(parsedLng) ? null : { lat: parsedLat, lng: parsedLng };
};

function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  // Hämtar kategorier och evenemang vid första renderingen
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setLoadingCategories(false);
      });

    fetchEvents(10, 50, 1, setLoadingEvents, setEvents);
  }, []);

  // När en kategori väljs
  const handleSubItemClick = async (subItem: string) => {
    try {
      setSelectedSubItem(subItem);

      if (subItem === 'Evenemang') {
        // Normalisera koordinaterna för evenemang
        const validEvents = events
          .map((event: any) => {
            // Här normaliserar vi koordinaterna för varje evenemang
            const { lat, lng } = normalizeCoordinates(event.lat, event.lng);
            return { ...event, lat, lng };
          })
          .filter(event => event.lat !== 0 && event.lng !== 0);

        setSelectedCategory(validEvents);
      } else {
        const response = await fetch(
          `https://turid.visitvarmland.com/api/v8/products?categories=${subItem.toLowerCase()}`
        );
        const data = await response.json();

        const products = Array.isArray(data.data) ? data.data : [];
        const filteredProducts = products.filter((product: any) =>
          product.categories.some((category: any) => category.title === subItem)
        );
        const allPlaces = filteredProducts
          .flatMap((product: any) => product.places || [])
          .map((place: any) => {
            // Normalisera koordinaterna för varje plats
            const { lat, lng } = normalizeCoordinates(place.latitude, place.longitude);
            return { ...place, lat, lng };
          })
          .filter(place => place.lat !== 0 && place.lng !== 0);
        setSelectedCategory(allPlaces);
      }
    } catch (error) {
      console.error('Fel vid hämtning av platser:', error);
    }
  };
  
  const handleItemClick = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
  

  if (loadingCategories || loadingEvents) {
    return null;
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
                    onClick={() => 
                      handleSubItemClick(subItem)}
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
          onClick={() => setActiveIndex(activeIndex === -1 ? null : -1)} 
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
