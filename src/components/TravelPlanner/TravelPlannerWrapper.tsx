import { useLocationStore } from '../../store/useLocationStore';
import TripInput from './TripInput';
import TriggerActionBtn from './TriggerActionBtn';

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
    <section className="p-8 bg-slate-100 border border-slate-300 rounded-md grid gap-6">
      {/* Input Section */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-slate-700">Planera din resa</h2>
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
