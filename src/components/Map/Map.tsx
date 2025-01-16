import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

function Map() {
  const [center, setCenter] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]); 
        },
        (error) => {
          console.error("Error getting location:", error);
          setCenter([57.7089, 11.9746]); 
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCenter([57.7089, 11.9746]); 
    }
  }, []);

  if (!center) {
    return <p>Loading map...</p>;
  }

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
      <Marker position={center} />
    </MapContainer>
  );
}

export default Map;
