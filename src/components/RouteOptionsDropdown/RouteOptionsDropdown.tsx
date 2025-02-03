//https://api.resrobot.se/v2.1/trip?format=json&originId=740000001&destId=740000003&passlist=true&showPassingPoints=true&accessId=3db84a98-5a7c-4447-be6f-5c7aec06aab2

import { useEffect, useState } from 'react';

// TODO: som användare när jag clickar på en hållplats på kartan vill jag få upp hela rutten för bussen i denna listan

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

const RouteOptionsDropdown = () => {
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          `https://api.resrobot.se/v2.1/trip?format=json&originId=740000003&destId=740000001&passlist=true&showPassingPoints=true&accessId=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        // Extracting only the names of Origin and Destination
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
  }, []);

  return (
    <div className="grid gap-4 p-4 border bg-gray-100 text-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800">Route Options</h2>
      {error && <p className="text-red-400">Error: {error}</p>}
      {routeNames.length > 0 ? (
        <ul className="grid gap-2">
          {routeNames.map((name, index) => (
            <li
              key={index}
              className="p-2 bg-gray-300 text-gray-800 rounded-md border"
            >
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
