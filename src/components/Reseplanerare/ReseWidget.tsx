import TripInput from './TripInput';
import TravelOptions from './TravelOptions';
import DatePickerComponent from './DatePickerComponent';
import WidgetHeader from './WidgetHeader';

function ReseWidget() {
  return (
    <>
      <section
        className="p-5 border rounded-md bg-slate-500 w-[500px] gap-5 grid grid-cols-1"
        style={{
          gridTemplateRows: 'auto auto auto',
          gridGap: '1rem',
        }}
      >
        <WidgetHeader />
        <TripInput />
        <TravelOptions />
        <DatePickerComponent />
      </section>
    </>
  );
}

export default ReseWidget;
