import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';

interface LocationStore {
  from: string;
  to: string;
  setFromLocation: (latlng: LatLngExpression) => void;
  setToLocation: (latlng: LatLngExpression) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  from: '',
  to: '',
  setFromLocation: (latlng) => {
  
    const [lat, lng] = latlng as [number, number];
    set({ from: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  },
  setToLocation: (latlng) => {
 
    const [lat, lng] = latlng as [number, number];
    set({ to: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  },
}));