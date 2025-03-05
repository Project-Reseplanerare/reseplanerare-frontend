//markerstore interface
interface MarkerStore {
  centerMarker: [number, number] | null;
  setCenterMarker: (center: [number, number]) => void;
  markersRemovable: boolean;
  setMarkersRemovable: (removable: boolean) => void;
}

export default MarkerStore;
