// React imports
import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Leaflet imports
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  CircleMarker,
  Tooltip,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';

// Utils imports
import {
  fetchNearbyBusStops,
  fetchNearbyTrains,
} from '../../utils/api/fetchNearbyStops';
import { fetchAddress } from '../../utils/api/fetchAdress';
import { getRoute } from '../../utils/api/getRoute';
import { handleRemoveMarker } from '../../utils/mapUtils/handleRemoveMarker';
import { fetchEvents } from '../../utils/api/fetchEvents';

// Store imports
import { useLocationStore } from '../../store/useLocationStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';
import { useRouteStopStore } from '../../store/useRouteStopStore';

// Other imports
import MapCenterUpdater from './MapCenterUpdater';
import MapClickHandler from './MapClickHandler';
import FilterEventsByBounds from './FilterEventsByBounds';
import { useGeolocation } from '../../hooks/mapHooks/useGeoLocation';

// Icons from Assets folder
// import busIcon from './../../assets/bus-solid.svg';
// import trainIcon from './../../assets/train-solid.svg';
// import carIcon from './../../assets/car-solid.svg';

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
    from,
  } = useLocationStore();

  const { selectedOption } = useTravelOptionsStore();

  const { stopsCoords } = useRouteStopStore();

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
          const segmentRoute = await getRoute(
            markers[i],
            markers[i + 1],
            setLoading
          );
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
    setStops([]);

    switch (selectedOption) {
      case 'Bil':
        fetchEvents(50, 100, 1, setLoading, setEvents);
        break;

      case 'Buss':
        if (Array.isArray(center) && center.length === 2) {
          fetchNearbyBusStops(center as [number, number], setLoading, setStops);
        }
        break;

      case 'Tåg':
        if (Array.isArray(center) && center.length === 2) {
          fetchNearbyTrains(center as [number, number], setLoading, setStops);
        }
        break;

      default:
        break;
    }
  }, [selectedOption, center]);

  const handleEventMarkerClick = async (lat: number, lng: number) => {
    setToLocation([lat, lng]);
    await fetchAddress(lat, lng, 'to', setToAddress, setToAddress);

    if (markers.length > 0) {
      const userMarker = markers[markers.length - 1];
      setRoute([userMarker, [lat, lng]]);
      setLineDrawn(true);
    }
  };

  useEffect(() => {
    const updateRoadRoute = async () => {
      if (stopsCoords.length > 0 && center) {
        const fetchedRoute = await getRoute(
          stopsCoords[0].coords,
          center,
          setLoading
        );
        setRoute(fetchedRoute);
      }
    };

    updateRoadRoute();
  }, [stopsCoords, center]);

  if (!center) return <p>Loading map...</p>;

  return (
    <MapContainer center={center} zoom={13} className="h-[1fr] w-[100%]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy;"
      />

      <MapCenterUpdater />
      <MapClickHandler disabled={stopsCoords.length > 0} />

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
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="
              display: flex; 
              align-items: center; 
              justify-content: center; 
              width: 30px; 
              height: 30px; 
              background: white; 
              border-radius: 50%;   
              border: 2px solid #007bff;">
              <i  style="color: #007bff; font-size: 16px;"></i>
            </div>`,
                  iconSize: [30, 30],
                  iconAnchor: [15, 30],
                })}
                eventHandlers={{
                  click: () => handleEventMarkerClick(lat, lng),
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
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            width: 30px; 
            height: 30px; 
            background: white; 
            border-radius: 50%; 
            border: 2px solid #28a745;">
            <i class="fas fa-bus" style="color: #28a745; font-size: 16px;"></i>
          </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
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

      {/* Tåg (Train) markers */}
      <MarkerClusterGroup>
        {selectedOption === 'Tåg' &&
          stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.lat, stop.lon] as LatLngExpression}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            width: 30px; 
            height: 30px; 
            background: white; 
            border-radius: 50%; 
            border: 2px solid #ff5733;">
            <i class="fas fa-train" style="color: #ff5733; font-size: 16px;"></i>
          </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
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

      {/* Marker you add by clicking */}
      {markers.map((position, index) => {
        const [lat, lng]: [number, number] = position as [number, number];
        return (
          <Marker
            key={index}
            position={[lat, lng]}
            eventHandlers={
              stopsCoords.length === 0
                ? {
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
                  }
                : {}
            }
          >
            <Popup>
              Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)}
            </Popup>
          </Marker>
        );
      })}

      {route.length > 0 && lineDrawn && stopsCoords.length === 0 && (
        <>
          <Polyline positions={route} color="#0089e7" weight={5} opacity={1} />
          <div>Total distance: {calculatePolylineDistance(route)} km</div>
        </>
      )}

      {route.length > 0 && stopsCoords.length > 0 && lineDrawn && (
        <>
          <Polyline
            positions={stopsCoords.map((stop) => stop.coords)}
            color="#0089e7"
            weight={5}
            opacity={1}
          />

          <Polyline
            positions={route}
            color="#434747"
            weight={3}
            opacity={1}
            dashArray="5,5"
          />
          {stopsCoords.map((stop, index) => (
            <CircleMarker
              key={index}
              center={stop.coords}
              radius={6}
              color="#0089e7"
              fillColor="white"
              fillOpacity={1}
              weight={3}
            >
              <Popup>{stop.name || 'Bus Stop'}</Popup>
            </CircleMarker>
          ))}
          {/* markers for first and last stops */}
          <Marker position={stopsCoords[0].coords}>
            <Tooltip permanent>{`START: ${
              stopsCoords[0].name || 'Start'
            }`}</Tooltip>
          </Marker>

          <Marker position={stopsCoords[stopsCoords.length - 1].coords}>
            <Tooltip permanent>{`STOP: ${
              stopsCoords[stopsCoords.length - 1].name || 'End'
            }`}</Tooltip>
          </Marker>
        </>
      )}
      {loading && <p>Loading route...</p>}
    </MapContainer>
  );
}

export default Map;
