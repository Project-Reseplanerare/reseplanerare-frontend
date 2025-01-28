import { useEffect } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useMap } from "react-leaflet";

const MapCenterUpdater = () => {
  const map = useMap();
  const { tempCenter } = useLocationStore();

  useEffect(() => {
    if (tempCenter) {
      map.setView(tempCenter, 16);
    }
  }, [tempCenter, map]);

  return null;
}

export default MapCenterUpdater