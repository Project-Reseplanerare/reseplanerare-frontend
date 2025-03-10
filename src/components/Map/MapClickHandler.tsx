// react-leaflet imports
import { useMapEvents } from 'react-leaflet';
//import uselocationstore
import { useLocationStore } from '../../store/useLocationStore';
// import fetchadress api util
import { fetchAddress } from '../../utils/api/fetchAdress';

export const MapClickHandler = ({ disabled }: { disabled: boolean }) => {
  const { setToLocation, setFromAddress, setToAddress, setMarkers } =
    useLocationStore();

  useMapEvents({
    click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;

      setMarkers([[lat, lng]]);
      setToLocation([lat, lng]);
      fetchAddress(lat, lng, 'to', setFromAddress, setToAddress);
    },
  });

  return null;
};
