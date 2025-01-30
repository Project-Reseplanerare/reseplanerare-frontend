import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import MapCenterUpdater from './MapCenterUpdater';
import { fetchEvents } from '../../utils/api/fetchEvents';
import FilterEventsByBounds from './FilterEventsByBounds';
import MapClickHandler from './MapClickHandler';
import { handleRemoveMarker } from '../../utils/mapUtils/handleRemoveMarker';
import { getRoute } from '../../utils/api/getRoute';
import { useGeolocation } from '../../hooks/mapHooks/useGeoLocation';
import L from 'leaflet';
import {
  fetchNearbyBusStops,
  fetchNearbyTrains,
} from '../../utils/api/fetchNearbyStops';
import { fetchAddress } from '../../utils/api/fetchAdress';
import busIcon from './../../assets/bus-solid.svg';
import trainIcon from './../../assets/train-solid.svg';
import carIcon from './../../assets/car-solid.svg';

function Map() {
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);

  const {
    setToLocation,
    // setFromLocation,
    // setFromAddress,
    setToAddress,
    lineDrawn,
    setLineDrawn,
    markers,
    setMarkers,
    from
  } = useLocationStore();

  const { selectedOption } = useTravelOptionsStore();

  // Use the custom hook to handle geolocation
  const center = useGeolocation();

  useEffect(() => {
    if (!lineDrawn) {
      setMarkers([]);
    }
  }, [lineDrawn, setMarkers]);

  useEffect(() => {
    const updateRoute = async () => {
      if (from && markers.length > 0 && lineDrawn) {
        let routeData: LatLngExpression[] = [];
  
        const firstSegment = await getRoute(from, markers[0], setLoading);
        routeData = [...routeData, ...firstSegment];
  
        for (let i = 0; i < markers.length - 1; i++) {
          const segmentRoute = await getRoute(markers[i], markers[i + 1], setLoading);
          routeData = [...routeData, ...segmentRoute];
        }
  
        setRoute(routeData);
      } else {
        setRoute([]);
      }
    };
  
    updateRoute();
  }, [from, markers, lineDrawn]);

  const calculatePolylineDistance = (route: LatLngExpression[]): number => {
    let totalDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
      const start = L.latLng(route[i]);
      const end = L.latLng(route[i + 1]);

      totalDistance += start.distanceTo(end);
    }

    return totalDistance / 1000;
  };

  useEffect(() => {
    if (route.length > 0) {
      const polylineDistance = calculatePolylineDistance(route);
      console.log('Polyline distance:', polylineDistance, 'km');
    }
  }, [route]);

  useEffect(() => {
    if (selectedOption === 'Bil') {
      fetchEvents(50, 100, 1, setLoading, setEvents);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption === 'Buss') {
      if (Array.isArray(center) && center.length === 2) {
        fetchNearbyBusStops(center as [number, number], setLoading, setStops);
      }
    } else {
      setStops([]);
    }
  }, [center, selectedOption]);

  useEffect(() => {
    if (selectedOption === 'Tåg') {
      if (Array.isArray(center) && center.length === 2) {
        fetchNearbyTrains(center as [number, number], setLoading, setStops);
      }
    } else {
      setStops([]);
    }
  }, [center, selectedOption]);

  const handleEventMarkerClick = async (lat: number, lng: number) => {
    setToLocation([lat, lng]);
    await fetchAddress(lat, lng, 'to', setToAddress, setToAddress);

    // Check if there's a user marker, then create the route
    if (markers.length > 0) {
      const userMarker = markers[markers.length - 1]; // Last marker placed by user
      setRoute([userMarker, [lat, lng]]);
      setLineDrawn(true);
    }
  };

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

      {/* Car markers */}
      {selectedOption === 'Bil' && (
        <MarkerClusterGroup>
          {filteredEvents.map((event, index) => {
            const { lat, lng, title, description } = event;
            return (
              <Marker
                key={index}
                position={[lat, lng]}
                icon={L.icon({
                  iconUrl: carIcon,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
                eventHandlers={{
                  click: () => handleEventMarkerClick(lat, lng),
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
      )}

      {/* Bus markers */}
      <MarkerClusterGroup>
        {selectedOption === 'Buss' &&
          stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.lat, stop.lon] as LatLngExpression}
              icon={L.icon({
                iconUrl: busIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <strong>{stop.name}</strong>
                <p>
                  {stop.lat}, {stop.lon}
                </p>
                <p>Distance: {stop.dist} meters</p>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>

      {/* Tåg markers */}
      <MarkerClusterGroup>
        {selectedOption === 'Tåg' &&
          stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.lat, stop.lon] as LatLngExpression}
              icon={L.icon({
                iconUrl: trainIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <strong>{stop.name}</strong>
                <p>
                  {stop.lat}, {stop.lon}
                </p>
                <p>Distance: {stop.dist} meters</p>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>

      {/* Bil no api markers */}
      {selectedOption === 'Bil' && (
        <MarkerClusterGroup>
          {filteredEvents.map((event, index) => {
            const { lat, lng, title, description } = event;
            return (
              <Marker
                key={index}
                position={[lat, lng]}
                eventHandlers={{
                  click: () => handleEventMarkerClick(lat, lng),
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
      )}

      {/* Marker you add by clicking */}
      {markers.map((position, index) => {
        const [lat, lng]: [number, number] = position as [number, number];
        return (
          <Marker
            key={index}
            position={[lat, lng]}
            eventHandlers={{
              click: () =>
                handleRemoveMarker(
                  index,
                  lineDrawn,
                  setMarkers,
                  setToAddress,
                  setLineDrawn
                ),
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
        <>
          <Polyline positions={route} color="blue" weight={3} opacity={0.7} />
          <div>Total distance: {calculatePolylineDistance(route)} km</div>
        </>
      )}

      {loading && <p>Loading route...</p>}
    </MapContainer>
  );
}

export default Map;
