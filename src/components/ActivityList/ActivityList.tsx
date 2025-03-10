// React import
import { useState, useEffect } from 'react';
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
// utils Imports
import { fetchCategories } from '../../utils/api/fetchCategories';
import { fetchEvents } from '../../utils/api/fetchEventsAndProducts';
// import icons
import cultureIcon from '../../assets/culture.svg';
import foodIcon from '../../assets/food.svg';
import houseIcon from '../../assets/house.svg';
import shoppingIcon from '../../assets/shopping.svg';
import sportCurlingIcon from '../../assets/sport-curling.svg';
import ticketIcon from '../../assets/ticket.svg';
// interface import
import ActivityListProps from '../../interfaces/ActivityInterfaces/ActivityList_interfaces';
//type import
import { IconCategory } from '../../types/ActivityListTypes/ActivityList_types';

const iconMapping: Record<IconCategory, string> = {
  'Kultur & historia': cultureIcon,
  'Mat & dryck': foodIcon,
  'Design & shopping': shoppingIcon,
  Boende: houseIcon,
  Aktiviteter: sportCurlingIcon,
  Evenemang: ticketIcon,
};

// Move to utility
const normalizeCoordinates = (lat: any, lng: any) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  return isNaN(parsedLat) || isNaN(parsedLng)
    ? null
    : { lat: parsedLat, lng: parsedLng };
};

export function ActivityList({ setSelectedCategory }: ActivityListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [totalPages, setTotalPages] = useState<number | null>(null);

  //move to hooks
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

  //move to hooks (pagination)
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

  const handleSubCategoryClick = async (subCategory: string) => {
    try {
      setSelectedSubCategory(subCategory);
      const response = await fetch(
        `https://turid.visitvarmland.com/api/v8/products?categories=${subCategory.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
  
      const data = await response.json();
      const products = Array.isArray(data.data) ? data.data : [];
  
      const allPlaces = products
        .flatMap((product: any) =>
          (product.places || []).map((place: any) => {
            const coords = normalizeCoordinates(place.latitude, place.longitude);
            return coords ? { ...place, ...coords, category: subCategory } : null;
          })
        )
        .filter((place) => place && place.lat !== 0 && place.lng !== 0);
  
      setSelectedCategory(allPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleItemClick = (id: number) => {
    setActiveIndex((prevIndex) => (prevIndex === id ? null : id));
  };

  const handlePageChange = (newPage: number) => {
    if (!Number.isInteger(newPage) || newPage < 1) return;
    setCurrentPage(newPage);
  };

  if (loadingCategories || loadingEvents) {
    return (
      <div className="loading-container">
        <p>Loading data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {categories.map((category) => {
        const isActive = activeIndex === category.id;

        return (
          <div key={category.id} className="w-full">
            <div
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border
                ${
                  isActive
                    ? 'bg-[#D3D3D3] bg-opacity-80 text-black dark:bg-darkDark dark:text-lightLight dark:border-white'
                    : 'bg-[#F9F9F9] text-darkDark dark:bg-darkDark dark:text-lightLight dark:border-white'
                } border-lightlightBorder dark:border-lightlight`}
              onClick={() => handleItemClick(category.id)}
            >
              <img
                src={iconMapping[category.label] || cultureIcon}
                alt="Icon"
                className="w-5 h-5 dark:filter dark:invert dark:hue-rotate-180"
              />
              <span>{category.label}</span>
              <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} />
            </div>

            {isActive && category.subCategory.length > 0 && (
              <div className="grid gap-2">
                {category.subCategory.map((subCategory: string, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition-all border ${
                      selectedSubCategory === subCategory
                        ? 'bg-[#D3D3D3] bg-opacity-80 dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                        : 'bg-white dark:bg-darkDark dark:text-lightLight border-none'
                    } border-lightlightBorder dark:border-lightlight`}
                    onClick={() => handleSubCategoryClick(subCategory)}
                  >
                    <span className="text-xs">{subCategory}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Event section */}
      <div className="w-full">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border 
            ${
              activeIndex === -1
                ? 'bg-[#D3D3D3] bg-opacity-80 text-black dark:bg-darkDark dark:text-lightLight dark:border-[#444]'
                : 'bg-white text-black dark:bg-darkDark dark:text-lightLight'
            } 
            border-lightlightBorder dark:border-lightlight`}
          onClick={() => setActiveIndex(activeIndex === -1 ? null : -1)}
        >
          <img
            src={ticketIcon}
            alt="Evenemang ikon"
            className="w-5 h-5 dark:filter dark:invert dark:hue-rotate-180"
          />
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
                className={`p-3 rounded-md cursor-pointer transition-all border ${
                  selectedSubCategory=== event.title
                    ? 'bg-[#D3D3D3] bg-opacity-80 dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                    : 'bg-white dark:bg-darkDark dark:text-lightLight border-none'
                } border-lightlightBorder dark:border-lightlight`}
                onClick={() => {
                  setSelectedCategory([event]);
                  setSelectedSubCategory(event.title);
                }}
              >
                <span className="text-xs">{event.title}</span>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-4 items-center">
              <button
                className={`px-4 py-2 rounded disabled:opacity-50 justify-self-start transition-all border 
                  ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-darkDark dark:text-lightLight'
                      : 'bg-[#D3D3D3] bg-opacity-80 text-black dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                  }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Föregående
              </button>

              <span className="justify-self-center text-darkDark dark:text-lightLight">
                Sida {currentPage}
                {totalPages ? ` av ${totalPages}` : ''}
              </span>

              <button
                className={`px-4 py-2 rounded disabled:opacity-50 justify-self-end transition-all border 
                  ${
                    (totalPages && currentPage === totalPages) ||
                    (!totalPages && events.length < itemsPerPage)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-darkDark dark:text-lightLight'
                      : 'bg-[#D3D3D3] bg-opacity-80 text-black dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                  }`}
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
