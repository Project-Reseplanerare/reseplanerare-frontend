import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../../utils/api/fetchCategories';

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
  Boende: houseIcon,
  'Design & shopping': shoppingIcon,
  Aktiviteter: sportCurlingIcon,
  Evenemang: ticketIcon,
};

function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {});
  }, []);

  const handleItemClick = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const handleSubItemClick = async (subItem: string) => {
    try {
  
      const response = await fetch(
        `https://turid.visitvarmland.com/api/v8/products?categories=${subItem.toLowerCase()}`
      );
  
      const data = await response.json();
  
      // Hämta produkter från data.data
      const products = Array.isArray(data.data) ? data.data : [];
  
      // Filtrera produkter som innehåller den valda subkategorin
      const filteredProducts = products.filter((product: any) =>
        product.categories.some((category: any) => category.title === subItem)
      );
  
      // Hämta alla "places" från dessa produkter
      const allPlaces = filteredProducts.flatMap((product: any) => product.places || []);
  
      // Uppdatera state
      setSelectedCategory(allPlaces);
      setSelectedSubItem(subItem);
    } catch (error) {
      console.error("Fel vid hämtning av platser:", error);
    }
  };

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
    </div>
  );
}

export default AttractionList;
