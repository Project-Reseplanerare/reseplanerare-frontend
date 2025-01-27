import { useState, useEffect } from 'react';
import { fetchAddress } from '../../utils/api/fetchAdress';
import { LatLngExpression } from 'leaflet';

export function useGeolocation(setFromLocation, setFromAddress, setToAddress) {
  const [center, setCenter] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setFromLocation([latitude, longitude]);
          fetchAddress(latitude, longitude, 'from', setFromAddress, setToAddress);
        },
        () => {
          const fallbackCenter: LatLngExpression = [59.378, 13.499];
          setCenter(fallbackCenter);
          setFromLocation(fallbackCenter);
          fetchAddress(fallbackCenter[0], fallbackCenter[1], 'from', setFromAddress, setToAddress);
        }
      );
    }
  }, [setFromLocation, setFromAddress, setToAddress]);

  return center;
}
