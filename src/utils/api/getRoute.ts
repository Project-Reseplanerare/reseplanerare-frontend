//import leaflet
import { LatLngExpression, LatLngTuple } from 'leaflet';

//osrm driving road routes
const OSRM_API = import.meta.env.VITE_ROAD_API;

export const getRoute = async (
  start: LatLngExpression,
  end: LatLngExpression,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<LatLngExpression[]> => {
  setLoading(true);
  try {
    const startCoords = normalizeLatLng(start);
    const endCoords = normalizeLatLng(end);

    if (!isValidLatLng(startCoords) || !isValidLatLng(endCoords)) {
      console.warn('Invalid coordinates detected');
      return [];
    }

    if (arePointsTooClose(startCoords, endCoords)) {
      return [startCoords];
    }

    const url = `${OSRM_API}/${formatCoords(startCoords)};${formatCoords(
      endCoords
    )}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.routes) || data.routes.length === 0) {
      console.warn('No routes found in the response.');
      return [];
    }

    return data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple
    );
  } catch (error) {
    console.error('Error fetching route:', (error as Error).message);
    return [];
  } finally {
    setLoading(false);
  }
};

const normalizeLatLng = (coords: LatLngExpression): LatLngTuple => {
  return Array.isArray(coords)
    ? (coords as LatLngTuple)
    : [coords.lat, coords.lng];
};

const isValidLatLng = (coords: LatLngTuple): boolean => {
  return (
    coords.length === 2 &&
    Number.isFinite(coords[0]) &&
    Number.isFinite(coords[1]) &&
    coords[0] >= -90 &&
    coords[0] <= 90 &&
    coords[1] >= -180 &&
    coords[1] <= 180
  );
};

const arePointsTooClose = (start: LatLngTuple, end: LatLngTuple): boolean => {
  const threshold = 0.0001;
  return (
    Math.abs(start[0] - end[0]) < threshold &&
    Math.abs(start[1] - end[1]) < threshold
  );
};

const formatCoords = (coords: LatLngTuple): string =>
  `${coords[1]},${coords[0]}`;
