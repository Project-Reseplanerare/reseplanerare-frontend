import { useState, useCallback } from 'react';
import TripInput from './TripInput';
import TriggerActionBtn from './TriggerActionBtn';


function TravelPlannerWrapper() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleInputChange = useCallback(
    (inputType: 'from' | 'to', value: string) => {
      if (inputType === 'from') {
        setFrom(value);
      } else {
        setTo(value);
      }
    },
    []
  );

  return (
    <section className="p-6 border border-gray-300 rounded-lg bg-gray-100 flex flex-col gap-5 flex-grow">
      <div className="flex flex-col">
        <TripInput onInputChange={handleInputChange} />
      </div>
    
      <TriggerActionBtn />
     
    </section>
  );
}

export default TravelPlannerWrapper;
