import { memo, useCallback, useMemo } from 'react';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
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
        icon: <FaCar className="text-3xl text-slate-700" />,
      },
      {
        id: 'Buss',
        label: 'Buss',
        icon: <FaBus className="text-3xl text-slate-700" />,
      },
      {
        id: 'Tåg',
        label: 'Tåg',
        icon: <FaTrain className="text-3xl text-slate-700" />,
      },
    ],
    []
  );

  return (
    <div className="grid grid-cols-3 auto-rows-fr gap-4 ">
      {travelOptions.map(({ id, label, icon }) => {
        const isSelected = selectedOption === id;
        return (
          <div
            key={id}
            role="button"
            aria-selected={isSelected}
            tabIndex={0}
            className={`grid place-items-center gap-2 p-4 bg-lightLight rounded-md cursor-pointer transition focus:outline-none border h-full w-full 
          ${
            isSelected
              ? 'bg-lightlight text-darkDark border-darkDark dark:bg-lightDark dark:text-darkDark dark:border-darkDark'
              : 'bg-lightDark text-darkDark border-darkDark dark:bg-darkDark dark:text-lightDark dark:border-lightDark'
          }`}
            onClick={() => handleOptionClick(id)}
            onKeyPress={(e) => e.key === 'Enter' && handleOptionClick(id)}
          >
            {icon}
            <span className="text-sm">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TravelOptions);
