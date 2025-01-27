import { LatLngExpression } from "leaflet";

export const getRoute = async (
    start: LatLngExpression,
    end: LatLngExpression,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<LatLngExpression[]> => {
    setLoading(true);
    try {
      const startCoords = Array.isArray(start) ? start : [start.lat, start.lng];
      const endCoords = Array.isArray(end) ? end : [end.lat, end.lng];
  
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
        return geoJsonCoords.map(([lng, lat]: [number, number]) => [lat, lng]);
      }
      return [];
    } catch (error) {
      console.error('Error fetching route:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };