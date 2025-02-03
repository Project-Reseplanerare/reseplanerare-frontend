import { useEffect, useState } from 'react';
import { useBusStopStore } from '../../store/useBusStopStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

const RouteOptionsDropdown = () => {
  const { fromStopId, toStopId } = useBusStopStore();
  const {isButtonClicked} = useSearchBtnStore()
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    if (!isButtonClicked || !fromStopId || !toStopId) return;

    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          `https://api.resrobot.se/v2.1/trip?format=json&originId=${fromStopId}&destId=${toStopId}&passlist=true&showPassingPoints=true&accessId=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

 
        const names =
          data.Trip?.map(
            (trip: any) => `${trip.Origin.name} → ${trip.Destination.name}`
          ) || [];

        setRouteNames(names);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchRoutes();
  }, [fromStopId, toStopId, isButtonClicked]); 

  return (
    <div className="grid gap-4 p-4 border bg-gray-100 text-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800">Route Options</h2>
      {error && <p className="text-red-400">Error: {error}</p>}
      {routeNames.length > 0 ? (
        <ul className="grid gap-2">
          {routeNames.map((name, index) => (
            <li key={index} className="p-2 bg-gray-300 text-gray-800 rounded-md border">
              {name}
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
