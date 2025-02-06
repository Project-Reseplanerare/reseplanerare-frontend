import { useRouteStopStore } from "../../store/useRouteStopStore";

interface Stop {
    lon: any;
    lat: any;
    extId: string;
    name: string;
    depTime?: string;
    arrTime?: string;
  }
  
  interface TripLeg {
    Stops?: { Stop: Stop[] };
  }
  
  interface Trip {
    LegList?: { Leg: TripLeg[] };
  }
  
  interface ApiResponse {
    Trip?: Trip[];
  }
  
  export const fetchRouteStopsForRoute = async (
    index: number,
    fromStopId: string,
    toStopId: string,
    apiKey: string,
    setRouteStops: React.Dispatch<React.SetStateAction<Record<number, Stop[]>>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<void> => {
    try {
      const url = `https://api.resrobot.se/v2.1/trip?format=json&originId=${fromStopId}&destId=${toStopId}&passlist=true&showPassingPoints=true&accessId=${apiKey}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: ApiResponse = await response.json();
      if (!data.Trip || data.Trip.length === 0) {
        return;
      }
  
      const trip = data.Trip[index] || data.Trip[0];
      let stops: Stop[] = [];
  
      if (trip.LegList?.Leg) {
        trip.LegList.Leg.forEach((leg) => {
          if (leg.Stops?.Stop) {
            stops = stops.concat(leg.Stops.Stop);
          }
        });
      }
  
      const uniqueStops = Array.from(new Map(stops.map((stop) => [stop.extId, stop])).values());
      uniqueStops.sort((a, b) => {
        const timeA = a.depTime || a.arrTime || "";
        const timeB = b.depTime || b.arrTime || "";
        return timeA.localeCompare(timeB);
      });
  
      setRouteStops((prev) => ({ ...prev, [index]: uniqueStops }));
  
  
      const stopsWithCoords = uniqueStops
      .filter((stop) => typeof stop.lat === "number" && typeof stop.lon === "number")
      .map((stop) => ({
        coords: [stop.lat as number, stop.lon as number] as [number, number], // Explicit tuple
        name: stop.name, // Only keeping necessary properties
      }));
  

      useRouteStopStore.getState().setStopsCoords(stopsWithCoords);
  
    } catch (err) {
      setError((err as Error).message);
    }
  };