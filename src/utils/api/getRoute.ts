import { LatLngExpression, LatLngTuple } from 'leaflet';

const OSRM_API = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Fetch route between two coordinates.
 */
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

/**
 * Normalize LatLngExpression into a LatLngTuple.
 */
const normalizeLatLng = (coords: LatLngExpression): LatLngTuple => {
  return Array.isArray(coords)
    ? (coords as LatLngTuple)
    : [coords.lat, coords.lng];
};

/**
 * Validate if coordinates are within valid latitude and longitude ranges.
 */
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

/**
 * Check if two points are too close to each other to require routing.
 */
const arePointsTooClose = (start: LatLngTuple, end: LatLngTuple): boolean => {
  const threshold = 0.0001;
  return (
    Math.abs(start[0] - end[0]) < threshold &&
    Math.abs(start[1] - end[1]) < threshold
  );
};

/**
 * Format coordinates for the OSRM API (lng,lat format).
 */
const formatCoords = (coords: LatLngTuple): string =>
  `${coords[1]},${coords[0]}`;
