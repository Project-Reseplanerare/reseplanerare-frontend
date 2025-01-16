import TripInput from './TripInput';
import TravelOptions from './TravelOptions';
import DatePickerComponent from './DatePickerComponent';
import WidgetHeader from './WidgetHeader';

function ReseWidget() {
  return (
    <section
      className=" p-6 border border-gray-300 rounded-lg bg-gray-100 grid grid-cols-1 gap-6"
      style={{
        gridTemplateRows: 'h-[min-content] h-[min-content] h-[min-content]',
      }}
    >
      <WidgetHeader />
      <div className="flex flex-col">
        <TripInput />
        <TravelOptions />
      </div>
      <DatePickerComponent />
    </section>
  );
}

export default ReseWidget;
