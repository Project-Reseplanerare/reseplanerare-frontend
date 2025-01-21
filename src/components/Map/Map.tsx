import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/useLocationStore'; // import the zustand store

const REVERSE_GEOCODE_API = 'https://nominatim.openstreetmap.org/reverse'; // Example API endpoint

function Map() {
  const [center, setCenter] = useState<LatLngExpression | null>(null);
  const [markers, setMarkers] = useState<LatLngExpression[]>([]);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setToLocation = useLocationStore((state) => state.setToLocation);
  const setFromLocation = useLocationStore((state) => state.setFromLocation);
  const setFromAddress = useLocationStore((state) => state.setFromAddress); // Store address for "from"
  const setToAddress = useLocationStore((state) => state.setToAddress); // Store address for "to"

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setFromLocation([latitude, longitude]);
          fetchAddress(latitude, longitude, 'from');
        },
        (error) => {
          console.error('Error getting location:', error);
          setCenter([57.7089, 11.9746]);
          setFromLocation([57.7089, 11.9746]);
          fetchAddress(57.7089, 11.9746, 'from');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCenter([57.7089, 11.9746]);
      fetchAddress(57.7089, 11.9746, 'from');
    }
  }, [setFromLocation]);

  const fetchAddress = async (lat: number, lng: number, type: 'from' | 'to') => {
    try {
      const response = await fetch(`${REVERSE_GEOCODE_API}?lat=${lat}&lon=${lng}&format=json`);
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || 'Unknown address';
        if (type === 'from') {
          setFromAddress(address);
        } else {
          setToAddress(address);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const getRoute = async (start: LatLngExpression, end: LatLngExpression) => {
    setLoading(true);
    try {
      const startCoords = Array.isArray(start) ? start : [start.lat, start.lng];
      const endCoords = Array.isArray(end) ? end : [end.lat, end.lng];

      const startCoord = `${startCoords[1]},${startCoords[0]}`;
      const endCoord = `${endCoords[1]},${endCoords[0]}`;

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const geoJsonCoords = data.routes[0].geometry.coordinates;
        return geoJsonCoords.map(([lng, lat]: [number, number]) => [lat, lng]);
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
      if (center && markers.length > 0) {
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
        setToLocation([lat, lng]);
        fetchAddress(lat, lng, 'to'); // Fetch address for clicked marker
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
      <Marker position={center}>
        <Popup>Your current location</Popup>
      </Marker>

      <MapClickHandler />

      {markers.map((position, index) => {
        const latLngArray = position as [number, number];
        return (
          <Marker
            key={index}
            position={latLngArray}
            eventHandlers={{
              click: () => handleRemoveMarker(index),
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              Latitude: {latLngArray[0].toFixed(4)}, Longitude:{' '}
              {latLngArray[1].toFixed(4)}
            </Popup>
          </Marker>
        );
      })}

      {route.length > 0 && (
        <Polyline positions={route} color="blue" weight={3} opacity={0.7} />
      )}

      {loading && <p>Loading route...</p>}
    </MapContainer>
  );
}

export default Map;