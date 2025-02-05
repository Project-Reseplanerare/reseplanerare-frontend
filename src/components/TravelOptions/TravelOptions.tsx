import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { FaTrain, FaBus, FaCar } from 'react-icons/fa';

const TravelOptions: React.FC = () => {
  const { selectedOption, setSelectedOption } = useTravelOptionsStore();

  const travelOptions = [
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
  ];

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Hur planerar du att resa?
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {travelOptions.map((option) => (
          <div
            key={option.id}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-md cursor-pointer transition ${
              selectedOption === option.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-slate-50 text-slate-700'
            }`}
            onClick={() => handleOptionClick(option.id)}
          >
            {option.icon}
            <span className="text-sm">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelOptions;
