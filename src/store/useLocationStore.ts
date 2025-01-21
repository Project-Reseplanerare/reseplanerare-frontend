import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';

interface LocationStore {
  from: string;
  to: string;
  fromAddress: string; // Add address for "from"
  toAddress: string; // Add address for "to"
  setFromLocation: (latlng: LatLngExpression) => void;
  setToLocation: (latlng: LatLngExpression) => void;
  setFromAddress: (address: string) => void; // Add method to set "from" address
  setToAddress: (address: string) => void; // Add method to set "to" address
}

export const useLocationStore = create<LocationStore>((set) => ({
  from: '',
  to: '',
  fromAddress: '',
  toAddress: '',
  setFromLocation: (latlng) => {
    const [lat, lng] = latlng as [number, number];
    set({ from: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  },
  setToLocation: (latlng) => {
    const [lat, lng] = latlng as [number, number];
    set({ to: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  },
  setFromAddress: (address) => set({ fromAddress: address }),
  setToAddress: (address) => set({ toAddress: address }),
}));