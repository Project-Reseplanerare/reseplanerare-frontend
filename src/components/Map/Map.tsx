import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';

function Map() {
  const [center, setCenter] = useState<LatLngExpression | null>(null);
  const [markers, setMarkers] = useState<LatLngExpression[]>([]);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCenter([57.7089, 11.9746]); 
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCenter([57.7089, 11.9746]); 
    }
  }, []);


  const getRoute = async (start: LatLngExpression, end: LatLngExpression) => {
    setLoading(true);
    try {
      const startArr = Array.isArray(start) ? start : [start.lat, start.lng];
      const endArr = Array.isArray(end) ? end : [end.lat, end.lng];

      const startCoord = `${startArr[1]},${startArr[0]}`;
      const endCoord = `${endArr[1]},${endArr[0]}`;
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const geoJsonCoords = data.routes[0].geometry.coordinates;
        return geoJsonCoords.map((coord: number[]) => [coord[1], coord[0]]);
      }
      return [];
    } catch (error) {
      console.error('Error fetching route:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateRoute = async () => {
      if (center && markers.length >= 1) {
        let routeData: LatLngExpression[] = [];


        const firstSegment = await getRoute(center, markers[0]);
        routeData = [...routeData, ...firstSegment];

  
        for (let i = 0; i < markers.length - 1; i++) {
          const segmentRoute = await getRoute(markers[i], markers[i + 1]);
          routeData = [...routeData, ...segmentRoute];
        }

        setRoute(routeData);
      } else {
        setRoute([]); 
      }
    };

    updateRoute();
  }, [markers, center]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers((prevMarkers) => [...prevMarkers, [lat, lng]]); 
      },
    });
    return null;
  };

  const handleRemoveMarker = (index: number) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));
  };

  if (!center) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer center={center} zoom={13} className="h-[1fr] w-[100%]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center} />

      <MapClickHandler />

      {markers.map((position, index) => (
        <Marker
          key={index}
          position={position}
          eventHandlers={{
            click: () => handleRemoveMarker(index),
          }}
        />
      ))}

      {route.length > 0 && (
        <Polyline
          positions={route}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      )}

      {loading && <p>Loading route...</p>}
    </MapContainer>
  );
}

export default Map;