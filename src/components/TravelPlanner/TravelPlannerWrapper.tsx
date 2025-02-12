import { useLocationStore } from '../../store/useLocationStore';
import TripInput from './TripInput';
import TriggerActionBtn from './TriggerActionBtn';
import Menu from '../Menu/Menu';

const TravelPlannerWrapper = () => {
  const { setFromAddress, setToAddress } = useLocationStore();

  const handleInputChange = (inputType: 'from' | 'to', value: string) => {
    if (inputType === 'from') {
      setFromAddress(value);
    } else {
      setToAddress(value);
    }
  };

  return (
    <section className="grid w-full p-8 border-darkLight dark:border-lightDark rounded bg-lightDark dark:bg-darkDark text-darkDark dark:text-lightLight">
      {/* Title Section */}
      <h2 className="text-2xl font-bold text-darkDark dark:text-lightLight">
        Planera din resa
      </h2>

      {/* Input Section */}
      <div className="grid gap-4">
        <Menu />
        <TripInput onInputChange={handleInputChange} />
      </div>

      {/* Button Section */}
      <div className="grid">
        <TriggerActionBtn />
      </div>
    </section>
  );
};

export default TravelPlannerWrapper;
