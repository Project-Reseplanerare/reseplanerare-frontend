import { useEffect } from 'react';
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export const MapCenterUpdater = () => {
  const map = useMap();
  const { stopsCoords } = useRouteStopStore();

  useEffect(() => {
    if (stopsCoords.length > 0) {
      const bounds = L.latLngBounds([
        stopsCoords[0].coords,
        stopsCoords[stopsCoords.length - 1].coords,
      ]);

      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stopsCoords, map]);

  return null;
};
