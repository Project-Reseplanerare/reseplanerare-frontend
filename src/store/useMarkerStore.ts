import { create } from 'zustand';
import MarkerStore from '../interfaces/storeInterfaces/markerStore_interfaces';

export const useMarkerStore = create<MarkerStore>((set) => ({
  centerMarker: null,
  setCenterMarker: (center) => set({ centerMarker: center }),
  markersRemovable: false,
  setMarkersRemovable: (removable) => set({ markersRemovable: removable }),
}));
