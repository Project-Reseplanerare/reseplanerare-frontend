//react imports
import { memo, useCallback, useMemo } from 'react';
//import store
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
//import icons
import { FaTrain, FaBus, FaCar } from 'react-icons/fa';

const TravelOptions = () => {
  const { selectedOption, setSelectedOption } = useTravelOptionsStore();

  const handleOptionClick = useCallback(
    (id: string) => {
      setSelectedOption(id);
    },
    [setSelectedOption]
  );

  const travelOptions = useMemo(
    () => [
      {
        id: 'Bil',
        label: 'Bil',
        icon: <FaCar className="text-2xl text-blueLight" />,
      },
      {
        id: 'Buss',
        label: 'Buss',
        icon: <FaBus className="text-2xl text-blueLight" />,
      },
      {
        id: 'Tåg',
        label: 'Tåg',
        icon: <FaTrain className="text-2xl text-blueLight" />,
      },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 auto-rows-fr gap-4">
      {travelOptions.map(({ id, label, icon }) => {
        const isSelected = selectedOption === id;
        return (
          <div
            key={id}
            role="button"
            aria-selected={isSelected}
            tabIndex={0}
            className={`grid grid-cols-[min-content_auto_minmax(0,1fr)] gap-2 p-2 rounded-md cursor-pointer transition focus:outline-none border border-lightlightBorder h-full w-full 
              ${
                isSelected
                  ? 'bg-[#D3D3D3] bg-opacity-80 text-darkDark border border-lightlightBorder dark:bg-darkDark dark:bg-opacity-100 dark:text-lightDark dark:border-[#444]'
                  : 'bg-white bg-opacity-100 text-darkDark border-lightlightBorder dark:border-lightlight dark:bg-[#1E1E1E] dark:bg-opacity-100 dark:text-lightDark '
              }`}
            onClick={() => handleOptionClick(id)}
            onKeyDown={(e) => e.key === 'Enter' && handleOptionClick(id)}
          >
            {icon}
            <span className="">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TravelOptions);
