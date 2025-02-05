import { create } from 'zustand';

interface MarkerStore {
  centerMarker: [number, number] | null;
  setCenterMarker: (center: [number, number]) => void;
  markersRemovable: boolean;
  setMarkersRemovable: (removable: boolean) => void;
}

export const useMarkerStore = create<MarkerStore>((set) => ({
  centerMarker: null,
  setCenterMarker: (center) => set({ centerMarker: center }),
  markersRemovable: false,  // Default: markers are NOT removable
  setMarkersRemovable: (removable) => set({ markersRemovable: removable }),
}));
