import { useEffect, useState } from 'react';
import { useBusStopStore } from '../../store/useBusStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

const RouteOptionsDropdown = () => {
  const { fromStopId, toStopId } = useBusStopStore();
  const { isButtonClicked } = useSearchBtnStore();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [travelTimes, setTravelTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!isButtonClicked || !fromStopId || !toStopId) return;

    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          `https://api.resrobot.se/v2.1/departureBoard?id=${fromStopId}&format=json&accessId=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

  
        const busDepartures = data.Departure?.filter((departure: any) => departure.ProductAtStop?.catOut === 'BLT') || [];

        const names = busDepartures.map((departure: any) => {
          const line = departure.ProductAtStop?.line || 'N/A'; 
          const departureTime = departure.time;
          const formattedTime = formatTravelTime(departureTime);
          return `${departure.ProductAtStop.name} (Line: ${line}) - Departs at: ${formattedTime}`;
        });

        const times = busDepartures.map((departure: any) => {
          const departureTime = departure.time;
          const travelTime = calculateTravelTime(departureTime);
          return travelTime;
        });

        setRouteNames(names);
        setTravelTimes(times);

      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchRoutes();
  }, [fromStopId, toStopId, isButtonClicked]);

  // Function to calculate the travel time
  const calculateTravelTime = (departureTime: string) => {
    const currentTime = new Date();
    const departureDate = new Date(`${new Date().toDateString()} ${departureTime}`);
    const timeDifference = departureDate.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      return 'Departed';
    }

    const minutes = Math.floor(timeDifference / (1000 * 60)); 
    return `${minutes} min`;
  };


  const formatTravelTime = (departureTime: string) => {
    const [hours, minutes] = departureTime.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid gap-4 p-4 border bg-gray-100 text-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800">Route Options</h2>
      {error && <p className="text-red-400">Error: {error}</p>}
      {routeNames.length > 0 ? (
        <ul className="grid gap-2">
          {routeNames.map((name, index) => (
            <li key={index} className="p-2 bg-gray-300 text-gray-800 rounded-md border">
              {name} - {travelTimes[index]}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Loading routes...</p>
      )}
    </div>
  );
};

export default RouteOptionsDropdown;