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
    <div className="bg-white border border-slate-300 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Hur planerar du att resa?
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {travelOptions.map(({ id, label, icon }) => {
          const isSelected = selectedOption === id;
          return (
            <div
              key={id}
              role="button"
              aria-selected={isSelected}
              tabIndex={0}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-md cursor-pointer transition focus:outline-none ${
                isSelected
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-50 text-slate-700'
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
    </div>
  );
};

export default memo(TravelOptions);
