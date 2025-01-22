import { useState, useCallback } from 'react';
import TripInput from './TripInput';
import WidgetHeader from './WidgetHeader';
import TriggerActionBtn from './TriggerActionBtn';

function ReseWidget() {
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

  // const handleButtonClick = () => {
  //   console.log({ from, to });
  // };

  return (
    <section className="p-6 border border-gray-300 rounded-lg bg-gray-100 grid grid-cols-1 gap-5">
      <WidgetHeader />
      <div className="flex flex-col">
        <TripInput onInputChange={handleInputChange} />
      </div>
      <TriggerActionBtn/> 
    </section>
  );
}

export default ReseWidget;
