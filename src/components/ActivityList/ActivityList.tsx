// React import
import { useState, useEffect } from 'react';
// import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTicket } from '@fortawesome/free-solid-svg-icons';
// utils Imports
import { fetchCategories } from '../../utils/api/fetchCategories';
import { fetchEvents } from '../../utils/api/fetchEventsAndProducts';
import { normalizeCoordinates } from '../../utils/mapUtils/normalizeCoordinates';
// import icons
import { categoryIcons, subcategoryToMainCategory } from '../Map/PlaceIcons';
import { eventIcon } from '../Map/EventIcon';
// interface import
import ActivityListProps from '../../interfaces/ActivityInterfaces/ActivityList_interfaces';

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
      .catch((error) => {
        console.error("Error fetching categories:", error);
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

  // Ändrat från subItem till subCategory
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
        const mainCategory = subcategoryToMainCategory[category.label] || category.label;
        const categoryData = categoryIcons[mainCategory];

        return (
          <div key={category.id} className="w-full">
            <div
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border
                ${isActive
                  ? 'bg-[#D3D3D3] bg-opacity-80 text-black border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-[#444]'
                  : 'bg-lightLight text-darkDark border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                }`}
              onClick={() => handleItemClick(category.id)}
            >
              <FontAwesomeIcon
                icon={categoryData?.icon}
                style={{ fontSize: '16px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
              />

              <span>{category.label}</span>
              <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} />
            </div>

            {isActive && category.subCategory.length > 0 && (
              <div className="grid gap-2">
                {category.subCategory.map((subCategory: string, index: number) => {

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-md border cursor-pointer transition-all
                        ${selectedSubCategory === subCategory
                          ? 'bg-[#D3D3D3] bg-opacity-80 border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-[#444]'
                          : 'bg-white border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                        }`}
                      onClick={() => handleSubCategoryClick(subCategory)}
                    >
                      <span className="text-xs">{subCategory}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Evenemang section */}
      <div className="w-full">
        <div
          className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition-all mb-2 border
            ${activeIndex === -1
              ? 'bg-gray-300 text-black border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-[#444]'
              : 'bg-white text-black border-lightlightBorder dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
            }`}
          onClick={() => {
            setActiveIndex(activeIndex === -1 ? null : -1);
          }}>
          <FontAwesomeIcon 
            icon={faTicket} 
            style={{ fontSize: '16px', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }} 
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
                className={`p-3 rounded-md border cursor-pointer transition-all ${selectedSubCategory === event.title ? 'bg-gray-300 ' : 'bg-white   dark:bg-darkDark dark:text-lightLight'
                  }`}
                onClick={() => {
                  setSelectedCategory([{ ...event, icon: eventIcon }]);
                  setSelectedSubCategory(event.title);
                }}>
                <span className="text-xs">{event.title}</span>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:text-darkDark"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                Föregående
              </button>
              <span>
                Sida {currentPage}
                {totalPages ? ` av ${totalPages}` : ''}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:text-darkDark"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  totalPages
                    ? currentPage === totalPages
                    : events.length < itemsPerPage
                }>
                Nästa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
