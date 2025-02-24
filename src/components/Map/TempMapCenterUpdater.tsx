//default react imports
import { useEffect } from 'react';
//react-leaflet imports
import { useMap } from 'react-leaflet';
//import uselocation store
import { useLocationStore } from '../../store/useLocationStore';

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
