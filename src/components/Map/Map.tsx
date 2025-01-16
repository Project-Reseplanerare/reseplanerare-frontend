import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import { LatLngExpression } from "leaflet";

function Map() {
  const center: LatLngExpression = [57.7089, 11.9746];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-[50vh] w-[50%]" 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

export default Map;
