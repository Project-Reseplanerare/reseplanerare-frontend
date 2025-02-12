// import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faBicycle,
//   faTicketAlt,
//   faLandmark,
//   faShoppingBag,
//   faUtensils,
//   faHotel,
//   faChevronDown,
//   faChevronUp,
// } from '@fortawesome/free-solid-svg-icons';

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
  setSelectedCategory: (category: string) => void;
}

const iconMapping: Record<string, string> = {
  "Kultur & historia": cultureIcon,
  "Mat & dryck": foodIcon,
  "Boende": houseIcon,
  "Design & shopping": shoppingIcon,
  "Aktiviteter": sportCurlingIcon,
  "Evenemang": ticketIcon,
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

  const handleSubItemClick = (subItem: string) => {
    setSelectedSubItem(subItem);
    setSelectedCategory(subItem);
    console.log("Kategori vald:", subItem);
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="w-full">
          <div
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-md cursor-pointer transition 
            ${activeIndex === category.id ? 'bg-blueLight border-blueDark dark:border-blueDark' : ''}`}
            onClick={() => handleItemClick(category.id)}
          >
            <img
              src={iconMapping[category.label] || cultureIcon}
              alt={`${category.label} ikon`}
              className="w-5 h-5"
            />
            <span className={`text-xs transition-colors 
              ${activeIndex === category.id ? 'text-lightLight' : 'text-darkDark dark:text-lightDark'}`}>
              {category.label}
            </span>
            <FontAwesomeIcon
              icon={activeIndex === category.id ? faChevronUp : faChevronDown}
              className="w-3 h-3 text-darkDark dark:text-lightDark transition-transform"
            />
          </div>

          {activeIndex === category.id && category.subItems.length > 0 ? (
            <div className="grid gap-1 mt-1">
              {category.subItems.map((subItem: string, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-md cursor-pointer transition 
                  bg-lightLight text-darkDark border-darkDark dark:bg-darkDark dark:text-lightDark dark:border-lightDark
                  hover:text-blueLight dark:hover:text-blueLight
                  ${selectedSubItem === subItem ? 'bg-blueDark text-dark' : ''}`}
                  onClick={() => handleSubItemClick(subItem)}
                >
                  <span className="text-xs">{subItem}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-0" />
          )}
        </div>
      ))}
    </div>
  );
}

export default AttractionList;