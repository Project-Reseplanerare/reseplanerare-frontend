//react imports
import { memo, useCallback, useMemo } from 'react';
//import store
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
//import icons
import { FaTrain, FaBus, FaCar } from 'react-icons/fa';
import { useUrlSync } from '../../hooks/urlHooks/useUrlSync';

const TravelOptions = () => {
  const { selectedOption, setSelectedOption } = useTravelOptionsStore();

  //url sync func
  useUrlSync(selectedOption, setSelectedOption);

  const handleOptionClick = useCallback(
    (id: string) => {
      setSelectedOption(id);
    },
    [setSelectedOption]
  );

  const travelOptions = useMemo(
    () => [
      {
        id: 'bil',
        label: 'bil',
        icon: <FaCar className="text-2xl text-blueLight" />,
      },
      {
        id: 'buss',
        label: 'buss',
        icon: <FaBus className="text-2xl text-blueLight" />,
      },
      {
        id: 'tåg',
        label: 'tåg',
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
                  ? 'bg-[#D3D3D3] bg-opacity-80 dark:bg-darkDark dark:text-lightLight dark:border-lightlight'
                  : 'bg-white dark:bg-darkDark dark:text-lightLight border-none'
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
