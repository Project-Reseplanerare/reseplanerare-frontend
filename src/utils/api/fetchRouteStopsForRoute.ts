//import routestopstore
import { useRouteStopStore } from '../../store/useRouteStopStore';
//import interfaces for routestops
import {
  Stop,
  ApiResponse,
} from './.././../interfaces/utilsInterfaces/routeStops_interfaces';

//resrobot route api
const BASE_ROUTE_API = import.meta.env.VITE_TRIP_API;

/**
 * Fetch route stops for a given trip.
 */
export const fetchRouteStopsForRoute = async (
  index: number,
  fromStopId: string,
  toStopId: string,
  apiKey: string,
  selectedOption: string | null,
  setRouteStops: React.Dispatch<React.SetStateAction<Record<number, Stop[]>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  departureTime: string,
  arrivalTime: string
): Promise<void> => {
  try {
    if (!selectedOption) {
      setError('No transport type selected.');
      return;
    }

    const expectedCatOut = selectedOption === 'tåg' ? 'JLT' : 'BLT';

    const url = `${BASE_ROUTE_API}?format=json&originId=${fromStopId}&destId=${toStopId}&passlist=true&showPassingPoints=true&accessId=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} ${response.statusText}`
      );
    }

    const data: ApiResponse = await response.json();

    if (!Array.isArray(data.Trip) || data.Trip.length === 0) {
      setError('No trips found.');
      return;
    }

    // Filter valid trips based on expected transport type
    const validTrips = data.Trip.filter((trip) =>
      trip.LegList?.Leg.some((leg) =>
        leg.Product?.some((prod) => prod.catOut === expectedCatOut)
      )
    );

    if (validTrips.length === 0) {
      setError(`No valid ${selectedOption} trips found.`);
      return;
    }

    const selectedTrip = validTrips[index] || validTrips[0];

    // Extract all valid stops from selected trip
    const stops =
      selectedTrip.LegList?.Leg.reduce<Stop[]>((acc, leg) => {
        if (
          leg.Product?.some((prod) => prod.catOut === expectedCatOut) &&
          leg.Stops?.Stop
        ) {
          acc.push(...leg.Stops.Stop);
        }
        return acc;
      }, []) ?? [];

    // Filter stops that have either departure or arrival time
    const filteredStops = stops.filter((stop) => stop.depTime || stop.arrTime);

    if (filteredStops.length === 0) {
      setError(`No valid stops found for ${selectedOption}.`);
      return;
    }

    // Deduplicate stops based on extId and time
    const uniqueStops = Array.from(
      new Map(
        filteredStops.map((stop) => [
          `${stop.extId}-${stop.depTime || stop.arrTime}`,
          stop,
        ])
      ).values()
    );

    // Sort stops by departure/arrival time
    uniqueStops.sort((a, b) => {
      const timeA = a.depTime || a.arrTime || '23:59:59';
      const timeB = b.depTime || b.arrTime || '23:59:59';
      return timeA.localeCompare(timeB);
    });

    // Ensure first and last stop have correct departure/arrival times
    if (uniqueStops.length > 0) {
      uniqueStops[0].depTime = departureTime;
      uniqueStops[uniqueStops.length - 1].arrTime = arrivalTime;
    }

    // Update the route stops state
    setRouteStops((prev) => ({ ...prev, [index]: uniqueStops }));

    // Extract stops with valid coordinates
    const stopsWithCoords = uniqueStops
      .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lon))
      .map((stop) => ({
        coords: [stop.lat, stop.lon] as [number, number],
        name: stop.name,
      }));

    if (stopsWithCoords.length > 0) {
      useRouteStopStore.getState().setStopsCoords(stopsWithCoords);
    }
  } catch (error) {
    setError(`Error fetching stops: ${(error as Error).message}`);
  }
};
