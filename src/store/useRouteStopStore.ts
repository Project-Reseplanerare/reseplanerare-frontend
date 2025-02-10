import { create } from "zustand";

interface RouteStopStore {
  fromStopId: string;
  toStopId: string;
  routeMarkers: { coords: [number, number]; name?: string }[]; 
  setRouteMarkers: (stops: { coords: [number, number]; name?: string }[]) => void;
  stopsCoords: { coords: [number, number]; name?: string }[];
  setStopsCoords: (stops: { coords: [number, number]; name?: string }[]) => void;
  setFromStopId: (id: string) => void;
  setToStopId: (id: string) => void;
}

export const useRouteStopStore = create<RouteStopStore>((set) => ({
  fromStopId: "",
  toStopId: "",
  routeMarkers: [], 
  setRouteMarkers: (stops) => set({ routeMarkers: stops }),
  stopsCoords: [],
  setStopsCoords: (stops) => set({ stopsCoords: stops }),
  setFromStopId: (id) => set({ fromStopId: id }),
  setToStopId: (id) => set({ toStopId: id }),
}));
