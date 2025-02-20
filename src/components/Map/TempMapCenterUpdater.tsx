import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useLocationStore } from "../../store/useLocationStore";

export const TempMapCenterUpdater = () => {
  const map = useMap();
  const tempCenter = useLocationStore((state) => state.tempCenter);

  useEffect(() => {
    if (tempCenter) {
      map.setView(tempCenter, map.getZoom());
    }
  }, [tempCenter, map]);

  return null;
};