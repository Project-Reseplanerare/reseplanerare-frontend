import { LatLngExpression } from 'leaflet';

interface LocationStore {
  from: string;
  to: string;
  fromAddress: string;
  toAddress: string;
  lineDrawn: boolean;
  markers: LatLngExpression[];
  zoom: number;
  tempCenter: LatLngExpression | null;
  setFromLocation: (latlng: LatLngExpression) => void;
  setToLocation: (latlng: LatLngExpression) => void;
  setFromAddress: (address: string) => void;
  setToAddress: (address: string) => void;
  setLineDrawn: (status: boolean) => void;
  setMarkers: (
    markersOrUpdater:
      | LatLngExpression[]
      | ((prev: LatLngExpression[]) => LatLngExpression[])
  ) => void;
  setTempCenter: (latlng: LatLngExpression) => void;
}

export default LocationStore;
