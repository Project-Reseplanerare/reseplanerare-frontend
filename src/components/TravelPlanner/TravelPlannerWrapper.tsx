//import store
import { useLocationStore } from '../../store/useLocationStore';
//imoirt tripinput component
import { TripInput } from './TripInput';
//import main search button
import { TriggerActionBtn } from './TriggerActionBtn';
//import menu component
import { Menu } from '../Menu/Menu';

export const TravelPlannerWrapper = () => {
  const { setFromAddress, setToAddress } = useLocationStore();

  const handleInputChange = (inputType: 'from' | 'to', value: string) => {
    if (inputType === 'from') {
      setFromAddress(value);
    } else {
      setToAddress(value);
    }
  };

  return (
    <section className="grid w-full p-8 shadow-md rounded border-darkLight z-0 dark:border-lightDark  backdrop-blur-md bg-lightDark/90 dark:bg-darkDark/90 text-darkDark dark:text-lightLight">
      <h2 className="text-2xl font-bold text-darkDark dark:text-lightLight">
        Planera din resa
      </h2>
      <div className="grid gap-4">
        <Menu />
        <TripInput onInputChange={handleInputChange} />
      </div>
      <div className="grid ">
        <TriggerActionBtn />
      </div>
    </section>
  );
};
