import {create} from 'zustand';


interface MarkerStore {
    centerMarker: [number, number] | null;
    setCenterMarker: (center: [number, number]) => void;
  }
  
  export const useMarkerStore = create<MarkerStore>((set) => ({
    centerMarker: null,
    setCenterMarker: (center) => set({ centerMarker: center }),
  }));