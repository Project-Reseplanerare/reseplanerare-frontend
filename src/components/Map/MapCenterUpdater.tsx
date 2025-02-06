import { useEffect } from "react";
import { useBusStopStore } from "../../store/useBusStopStore";
import { useMap } from "react-leaflet"
import L from 'leaflet';


const MapCenterUpdater = () => {
  const map = useMap();
  const { stopsCoords } = useBusStopStore();

  useEffect(() => {
    if (stopsCoords.length > 0) {
 
      const bounds = L.latLngBounds([
        stopsCoords[0].coords,
        stopsCoords[stopsCoords.length - 1].coords,
      ]);
      
      // Fit the map to the bounds
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stopsCoords, map]);

  return null;
};

export default MapCenterUpdater;