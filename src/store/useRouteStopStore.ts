// Import Zustand
import { create } from 'zustand';
// import routestopstore interface
import RouteStopStore from '../interfaces/storeInterfaces/routeStop_interfaces';

export const useRouteStopStore = create<RouteStopStore>((set) => ({
  fromStopId: '',
  toStopId: '',
  routeMarkers: [],
  setRouteMarkers: (stops) => set({ routeMarkers: stops }),
  stopsCoords: [],
  setStopsCoords: (stops) => set({ stopsCoords: stops }),
  setFromStopId: (id) => set({ fromStopId: id }),
  setToStopId: (id) => set({ toStopId: id }),
}));
