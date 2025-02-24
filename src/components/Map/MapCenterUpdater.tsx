//default react imports
import { useEffect } from 'react';
// store import
import { useRouteStopStore } from '../../store/useRouteStopStore';
//leaflet imports
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export const MapCenterUpdater = () => {
  const map = useMap();
  const { stopsCoords } = useRouteStopStore();

  useEffect(() => {
    if (!map || stopsCoords.length === 0) return;

    const bounds = L.latLngBounds(stopsCoords.map((stop) => stop.coords));

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stopsCoords, map]);

  return null;
};
