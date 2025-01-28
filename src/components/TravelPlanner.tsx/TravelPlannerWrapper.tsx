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
      } else if (inputType === 'to') {
        setTo(value);
      }
    },
    []
  );

  return (
    <section className="p-8 bg-slate-100 border border-slate-300 rounded-md grid gap-6">
      {/* Input Section */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-slate-700">Planera din resa</h2>
        <TripInput onInputChange={handleInputChange} />
      </div>

      {/* Button Section */}
      <div className="grid">
        <TriggerActionBtn from={from} to={to} />
      </div>
    </section>
  );
}

export default TravelPlannerWrapper;
