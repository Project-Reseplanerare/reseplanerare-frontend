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
  Product?: { catOut: string }[]; // Check transport category
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
  selectedOption: string | null,
  setRouteStops: React.Dispatch<React.SetStateAction<Record<number, Stop[]>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  try {
    const expectedCatOut = selectedOption === "Tåg" ? "JLT" : "BLT"; // JLT for train, BLT for bus

    const url = `https://api.resrobot.se/v2.1/trip?format=json&originId=${fromStopId}&destId=${toStopId}&passlist=true&showPassingPoints=true&accessId=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    if (!data.Trip || data.Trip.length === 0) {
      setError("No trips found.");
      return;
    }

    // Filter trips that match the selected transport type
    const validTrips = data.Trip.filter((trip) =>
      trip.LegList?.Leg.some((leg) => leg.Product?.some((prod) => prod.catOut === expectedCatOut))
    );

    if (validTrips.length === 0) {
      setError(`No valid ${selectedOption} trips found.`);
      return;
    }

    // Pick the requested index trip (or the first available valid trip)
    const trip = validTrips[index] || validTrips[0];
    let stops: Stop[] = [];

    // Extract stops only from legs that match the transport type
    trip.LegList?.Leg.forEach((leg) => {
      if (leg.Product?.some((prod) => prod.catOut === expectedCatOut) && leg.Stops?.Stop) {
        stops = stops.concat(leg.Stops.Stop);
      }
    });

    if (stops.length === 0) {
      setError(`No valid stops found for ${selectedOption}.`);
      return;
    }

    // Remove duplicate stops
    const uniqueStops = Array.from(new Map(stops.map((stop) => [stop.extId, stop])).values());
    uniqueStops.sort((a, b) => {
      const timeA = a.depTime || a.arrTime || "";
      const timeB = b.depTime || b.arrTime || "";
      return timeA.localeCompare(timeB);
    });

    // Update state only if stops exist
    setRouteStops((prev) => ({ ...prev, [index]: uniqueStops }));

    // Filter stops with valid coordinates
    const stopsWithCoords = uniqueStops
      .filter((stop) => typeof stop.lat === "number" && typeof stop.lon === "number")
      .map((stop) => ({
        coords: [stop.lat, stop.lon] as [number, number],
        name: stop.name,
      }));

    // Only update store if valid coordinates exist
    if (stopsWithCoords.length > 0) {
      useRouteStopStore.getState().setStopsCoords(stopsWithCoords);
    }
  } catch (err) {
    setError(`Error fetching stops: ${(err as Error).message}`);
  }
};