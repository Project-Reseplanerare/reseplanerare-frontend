// RouteStopsRoute interface
interface RouteStopStore {
  fromStopId: string;
  toStopId: string;
  routeMarkers: { coords: [number, number]; name?: string }[];
  setRouteMarkers: (
    stops: { coords: [number, number]; name?: string }[]
  ) => void;
  stopsCoords: { coords: [number, number]; name?: string }[];
  setStopsCoords: (
    stops: { coords: [number, number]; name?: string }[]
  ) => void;
  setFromStopId: (id: string) => void;
  setToStopId: (id: string) => void;
}

export default RouteStopStore;
