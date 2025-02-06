import { create } from "zustand";

interface BusStopStore {
  fromStopId: string;
  toStopId: string;
  busRouteMarkers: { coords: [number, number]; name?: string }[]; 
  setBusRouteMarkers: (stops: { coords: [number, number]; name?: string }[]) => void;
  stopsCoords: { coords: [number, number]; name?: string }[];
  setStopsCoords: (stops: { coords: [number, number]; name?: string }[]) => void;
  setFromStopId: (id: string) => void;
  setToStopId: (id: string) => void;
}

export const useBusStopStore = create<BusStopStore>((set) => ({
  fromStopId: "",
  toStopId: "",
  busRouteMarkers: [], 
  setBusRouteMarkers: (stops) => set({ busRouteMarkers: stops }),
  stopsCoords: [],
  setStopsCoords: (stops) => set({ stopsCoords: stops }),
  setFromStopId: (id) => set({ fromStopId: id }),
  setToStopId: (id) => set({ toStopId: id }),
}));
