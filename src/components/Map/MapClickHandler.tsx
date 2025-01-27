import { useMapEvents } from 'react-leaflet';
import { useLocationStore } from '../../store/useLocationStore';
import { fetchAddress } from '../../utils/api/fetchAdress';

const MapClickHandler = () => {
  const { setToLocation, setFromAddress, setToAddress, setMarkers } = useLocationStore();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setMarkers([[lat, lng]]);
      setToLocation([lat, lng]);
      fetchAddress(lat, lng, 'to', setFromAddress, setToAddress); 
    },
  });

  return null;
};

export default MapClickHandler;