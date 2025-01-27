import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import MapCenterUpdater from './MapCenterUpdater';
import { fetchEvents } from '../../utils/api/fetchEvents';
import FilterEventsByBounds from './FilterEventsByBounds';
import MapClickHandler from './MapClickHandler';
import { handleRemoveMarker } from '../../utils/mapUtils/handleRemoveMarker';
import { getRoute } from '../../utils/api/getRoute';
import { useGeolocation } from '../../hooks/mapHooks/useGeoLocation';
import { fetchAddress } from '../../utils/api/fetchAdress';

function Map() {
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

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

  // Use the custom hook to handle geolocation
  const center = useGeolocation(setFromLocation, setFromAddress, setToAddress);

  useEffect(() => {
    if (!lineDrawn) {
      setMarkers([]);
    }
  }, [lineDrawn, setMarkers]);

  useEffect(() => {
    fetchEvents(50, 100, 1, setLoading, setEvents);
  }, []); 

  useEffect(() => {
    const updateRoute = async () => {
      if (center && markers.length > 0 && lineDrawn) {
        let routeData: LatLngExpression[] = [];

        const firstSegment =  await getRoute(center, markers[0], setLoading);
        routeData = [...routeData, ...firstSegment];

        for (let i = 0; i < markers.length - 1; i++) {
          const segmentRoute = await getRoute(center, markers[0], setLoading);
          routeData = [...routeData, ...segmentRoute];
        }

        setRoute(routeData);
      } else {
        setRoute([]);
      }
    };

    updateRoute();
  }, [markers, center, lineDrawn]);

  if (!center) return <p>Loading map...</p>;

  return (
    <MapContainer center={center} zoom={13} className="h-[1fr] w-[100%]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapCenterUpdater />
      <MapClickHandler />

      <FilterEventsByBounds
        events={events}
        setFilteredEvents={setFilteredEvents}
      />

      <Marker position={center}>
        <Popup>Your current location</Popup>
      </Marker>

      <MarkerClusterGroup>
        {filteredEvents.map((event, index) => {
          const { lat, lng, title, description } = event;
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              eventHandlers={{
                click: async () => {
                  setMarkers((prev) => [...prev, [lat, lng]]);
                  setToLocation([lat, lng]);
                  fetchAddress(lat, lng, 'to', setFromAddress, setToAddress); 
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
        const [lat, lng]: [number, number] = position as [number, number];
        return (
          <Marker
            key={index}
            position={[lat, lng]}
            eventHandlers={{
              click: () => handleRemoveMarker(index, lineDrawn, setMarkers, setToAddress, setLineDrawn),
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
