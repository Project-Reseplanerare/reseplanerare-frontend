import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
  Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/useLocationStore';

const REVERSE_GEOCODE_API = 'https://nominatim.openstreetmap.org/reverse';
const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

function Map() {
  const [center, setCenter] = useState<LatLngExpression | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);

  const {
    setToLocation,
    setFromLocation,
    setFromAddress,
    setToAddress,
    lineDrawn,
    setLineDrawn,
    markers,
    setMarkers,
  } = useLocationStore();

  useEffect(() => {
    if (!lineDrawn) {
      setMarkers([]);
    }
  }, [lineDrawn, setMarkers]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setFromLocation([latitude, longitude]);
          fetchAddress(latitude, longitude, 'from');
        },
        () => {
          const fallbackCenter = [59.378, 13.499];
          setCenter(fallbackCenter);
          setFromLocation(fallbackCenter);
          fetchAddress(fallbackCenter[0], fallbackCenter[1], 'from');
        }
      );
    }
  }, [setFromLocation]);

  const fetchAddress = async (
    lat: number,
    lng: number,
    type: 'from' | 'to'
  ) => {
    try {
      const response = await fetch(
        `${REVERSE_GEOCODE_API}?lat=${lat}&lon=${lng}&format=json`
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || 'Unknown address';
        if (type === 'from') setFromAddress(address);
        else setToAddress(address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const limit = 10;
      const totalEvents = 30;
      let eventsFetched = 0;
      let page = 1;
      const allEvents: any[] = [];

      setLoading(true);

      while (eventsFetched < totalEvents) {
        const response = await fetch(
          `${EVENTS_API}?limit=${limit}&page=${page}`
        );
        if (!response.ok) break;

        const data = await response.json();
        const eventMarkers = data.data.map((event: any) => {
          const place = event.places?.[0] || {};
          return {
            lat: parseFloat(place.latitude) || 0,
            lng: parseFloat(place.longitude) || 0,
            title: event.title || 'Unknown Event',
            description: event.sales_text || 'No description available',
          };
        });

        allEvents.push(...eventMarkers);
        eventsFetched += eventMarkers.length;
        page += 1;

        if (eventMarkers.length < limit) break; // End loop if no more events
      }

      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      if (center && markers.length > 0 && lineDrawn) {
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
  }, [markers, center, lineDrawn]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Reset the markers array to only contain the new marker
        setMarkers([[lat, lng]]);
        setToLocation([lat, lng]);
        fetchAddress(lat, lng, 'to');
      },
    });
    return null;
  };

  const handleRemoveMarker = (index: number) => {
    if (!lineDrawn) {
      setMarkers((prev) => {
        const newMarkers = prev.filter((_, i) => i !== index);
        if (newMarkers.length === 0) setToAddress('');
        return newMarkers;
      });
    } else {
      setLineDrawn(false);
      setMarkers([]);
      setToAddress('');
    }
  };

  if (!center) return <p>Loading map...</p>;

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

      <MarkerClusterGroup>
        {events.map((event, index) => {
          const { lat, lng, title, description } = event;
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              eventHandlers={{
                click: async () => {
                  setMarkers((prev) => [...prev, [lat, lng]]);
                  setToLocation([lat, lng]);
                  fetchAddress(lat, lng, 'to');
                  setLineDrawn(true);
                },
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <strong>{title}</strong>
                <br />
                {description}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {markers.map((position, index) => {
        const [lat, lng] = position;
        return (
          <Marker
            key={index}
            position={[lat, lng]}
            eventHandlers={{
              click: () => handleRemoveMarker(index),
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)}
            </Popup>
          </Marker>
        );
      })}

      {route.length > 0 && lineDrawn && (
        <Polyline positions={route} color="blue" weight={3} opacity={0.7} />
      )}

      {loading && <p>Loading route...</p>}
    </MapContainer>
  );
}

export default Map;
