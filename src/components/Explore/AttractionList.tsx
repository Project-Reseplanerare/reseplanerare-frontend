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

const normalizeCoordinates = (lat: any, lng: any) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  return isNaN(parsedLat) || isNaN(parsedLng)
    ? null
    : { lat: parsedLat, lng: parsedLng };
};

export function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(() => {
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setLoadingEvents(true);
    fetchEvents(itemsPerPage, currentPage)
      .then(({ events: fetchedEvents, total }) => {
        setEvents(fetchedEvents);
        if (total) {
          setTotalPages(Math.ceil(total / itemsPerPage));
        } else if (fetchedEvents.length < itemsPerPage) {
          setTotalPages(currentPage);
        } else {
          setTotalPages(null);
        }
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, [currentPage]);

  const handleSubItemClick = async (subItem: string) => {
    try {
      setSelectedSubItem(subItem);
      if (subItem === 'Evenemang') {
        const validEvents = events
          .map((event: any) => {
            const coords = normalizeCoordinates(event.lat, event.lng);
            return coords ? { ...event, ...coords } : null;
          })
          .filter((event) => event && event.lat !== 0 && event.lng !== 0);
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
            const coords = normalizeCoordinates(
              place.latitude,
              place.longitude
            );
            return coords ? { ...place, ...coords } : null;
          })
          .filter((place) => place && place.lat !== 0 && place.lng !== 0);
        setSelectedCategory(allPlaces);
      }
    } catch (error) {
      console.error('Fel vid hämtning av platser:', error);
    }
  };

  const handleItemClick = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
            <div
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border border-lightlightBorder dark:border-lightlight 
              ${isActive ? 'bg-gray-300 text-black' : 'bg-white text-black'}`}
              onClick={() => handleItemClick(category.id)}
            >
              <img
                src={iconMapping[category.label as IconCategory] || cultureIcon}
                alt="Icon"
                className="w-5 h-5"
              />
              <span>{category.label}</span>
              <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} />
            </div>

            {isActive && category.subItems.length > 0 && (
              <div className="grid gap-2">
                {category.subItems.map((subItem: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${selectedSubItem === subItem ? 'bg-gray-300' : 'bg-white'
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

      {/* Evenemang section */}
      <div className="w-full">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border border-lightlightBorder dark:border-lightlight 
          ${activeIndex === -1
              ? 'bg-gray-300 text-black'
              : 'bg-white text-black'
            }`}
          onClick={() => setActiveIndex(activeIndex === -1 ? null : -1)}
        >
          <img src={ticketIcon} alt="Evenemang ikon" className="w-5 h-5" />
          <span>Evenemang</span>
          <FontAwesomeIcon
            icon={activeIndex === -1 ? faChevronUp : faChevronDown}
          />
        </div>

        {activeIndex === -1 && events.length > 0 && (
          <div className="grid gap-2">
            {events.map((event, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border cursor-pointer transition-all ${selectedSubItem === event.title ? 'bg-gray-300' : 'bg-white'
                  }`}
                onClick={() => {
                  setSelectedCategory([event]);
                  setSelectedSubItem(event.title);
                }}
              >
                <span className="text-xs">{event.title}</span>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Föregående
              </button>
              <span>
                Sida {currentPage}
                {totalPages ? ` av ${totalPages}` : ''}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  totalPages
                    ? currentPage === totalPages
                    : events.length < itemsPerPage
                }
              >
                Nästa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
