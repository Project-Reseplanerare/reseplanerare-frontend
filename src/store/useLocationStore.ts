import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';

interface LocationStore {
  from: string;
  to: string;
  fromAddress: string;
  toAddress: string;
  lineDrawn: boolean; 
  markers: LatLngExpression[]; 
  setFromLocation: (latlng: LatLngExpression) => void;
  setToLocation: (latlng: LatLngExpression) => void;
  setFromAddress: (address: string) => void;
  setToAddress: (address: string) => void;
  setLineDrawn: (status: boolean) => void;
  setMarkers: (markersOrUpdater: LatLngExpression[] | ((prev: LatLngExpression[]) => LatLngExpression[])) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  from: '',
  to: '',
  fromAddress: '',
  toAddress: '',
  lineDrawn: false,
  markers: [],
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
  setLineDrawn: (status) => set({ lineDrawn: status }),
  setMarkers: (markersOrUpdater) => set((state) => ({
    markers: typeof markersOrUpdater === 'function'
      ? markersOrUpdater(state.markers)
      : markersOrUpdater
  })),
}));