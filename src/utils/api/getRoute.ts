import { LatLngExpression, LatLngTuple } from "leaflet";

export const getRoute = async (
 start: LatLngExpression,
 end: LatLngExpression,
 setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<LatLngExpression[]> => {
 setLoading(true);
 try {
   const startCoords: LatLngTuple = Array.isArray(start) 
     ? (start as LatLngTuple) 
     : [start.lat, start.lng];
   const endCoords: LatLngTuple = Array.isArray(end)
     ? (end as LatLngTuple)
     : [end.lat, end.lng];

   // Validate coordinates
   if (!isValidLatLng(startCoords) || !isValidLatLng(endCoords)) {
     console.warn('Invalid coordinates detected');
     return [];
   }

   // Check if points are too close
   if (arePointsTooClose(startCoords, endCoords)) {
     return [startCoords];
   }

   const startCoord = `${startCoords[1]},${startCoords[0]}`;
   const endCoord = `${endCoords[1]},${endCoords[0]}`;

   const response = await fetch(
     `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`
   );

   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }

   const data = await response.json();

   if (data.routes && data.routes.length > 0) {
     const geoJsonCoords = data.routes[0].geometry.coordinates;
     return geoJsonCoords.map(([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple);
   }
   return [];
 } catch (error) {
   console.error('Error fetching route:', error);
   return [];
 } finally {
   setLoading(false);
 }
};

const isValidLatLng = (coords: LatLngTuple): boolean => {
 return coords.length === 2 &&
   !isNaN(coords[0]) &&
   !isNaN(coords[1]) &&
   coords[0] >= -90 &&
   coords[0] <= 90 &&
   coords[1] >= -180 &&
   coords[1] <= 180;
};

const arePointsTooClose = (start: LatLngTuple, end: LatLngTuple): boolean => {
 const threshold = 0.0001;
 return Math.abs(start[0] - end[0]) < threshold &&
   Math.abs(start[1] - end[1]) < threshold;
};