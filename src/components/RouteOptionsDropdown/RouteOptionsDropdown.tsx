//https://api.resrobot.se/v2.1/trip?format=json&originId=740000001&destId=740000003&passlist=true&showPassingPoints=true&accessId=3db84a98-5a7c-4447-be6f-5c7aec06aab2

import { useEffect, useState } from "react"

// TODO: som användare när jag clickar på en hållplats på kartan vill jag få upp hela rutten för bussen i denna listan

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY

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
          const names = data.Trip?.map(
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
      <div>
        <h2>Route Options</h2>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {routeNames.length > 0 ? (
          <ul>
            {routeNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        ) : (
          <p>Loading routes...</p>
        )}
      </div>
    );
  };
  
  export default RouteOptionsDropdown;