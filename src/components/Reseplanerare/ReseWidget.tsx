import { useState, useCallback } from 'react';
import TripInput from './TripInput';
import TravelOptions from './TravelOptions';
import DatePickerComponent from './DatePickerComponent';
import WidgetHeader from './WidgetHeader';
import Map from './../Map/Map';

function ReseWidget() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Use `useCallback` to memoize the function and prevent unnecessary re-renders
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
    <section
      className="p-6 border border-gray-300 rounded-lg bg-gray-100 grid grid-cols-1 gap-6"
      style={{
        gridTemplateRows: 'h-[min-content] h-[min-content] h-[min-content]',
      }}
    >
      {/* Widget Header */}
      <WidgetHeader />

      {/* Trip Input and Travel Options */}
      <div className="flex flex-col">
        <TripInput from={from} to={to} onInputChange={handleInputChange} />
        <TravelOptions />
      </div>

      {/* Date Picker */}
      <DatePickerComponent />

      {/* Map Section */}
      <div className="mt-6 h-96 w-full">
        <Map />
      </div>
    </section>
  );
}

export default ReseWidget;
