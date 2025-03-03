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
import { MapCenterUpdater } from './MapCenterUpdater';
import { MapClickHandler } from './MapClickHandler';
import { FilterEventsByBounds } from './FilterEventsByBounds';
import { useGeolocation } from '../../hooks/mapHooks/useGeoLocation';
import { TempMapCenterUpdater } from './TempMapCenterUpdater';
// import { FilterPlacesByBounds } from './FilterPlacesByBounds';
import { FilterLocationsByBounds } from './FilterLocationsByBounds';

// lagt till events som en prop
import MapProps from '../../interfaces/mapInterfaces/map_interfaces';

function Map({ places, events }: MapProps) {
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventss, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>(places);
  const [firstSegmentLength, setFirstSegmentLength] = useState(0);

  const {
    setToLocation,
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

  // to small to be a seperate hook
  useEffect(() => {
    if (!lineDrawn) {
      setMarkers([]);
    }
  }, [lineDrawn, setMarkers]);

  useEffect(() => {
    const updateRoute = async () => {
      if (from && markers.length > 0 && lineDrawn) {
        let routeData: LatLngExpression[] = [];

        const fromLatLng: LatLngExpression | null = from
          ? (from.split(', ').map(Number) as [number, number])
          : null;
        if (!fromLatLng) return;
  
        const computedFirstSegment = await getRoute(fromLatLng, markers[0], setLoading);

        const firstSegmentLength = computedFirstSegment.length;
        routeData = [...computedFirstSegment];
  

        for (let i = 0; i < markers.length - 1; i++) {
          const segmentRoute = await getRoute(markers[i], markers[i + 1], setLoading);
          routeData = [...routeData, ...segmentRoute];
        }

        setRoute(routeData);

        setFirstSegmentLength(firstSegmentLength);
      } else {
        setRoute([]);
        setFirstSegmentLength(0);
      }
    };
  
    updateRoute();
  }, [from, markers, lineDrawn]);
  

  //make this a utility function
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
      case 'bil':
        break;

      case 'buss':
        if (Array.isArray(center) && center.length === 2) {
          fetchNearbyBusStops(center as [number, number], setLoading, setStops);
        }
        break;

      case 'tåg':
        if (Array.isArray(center) && center.length === 2) {
          fetchNearbyTrains(center as [number, number], setLoading, setStops);
        }
        break;

      default:
        break;
    }
  }, [selectedOption, center]);

  // make into a utility function
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

  useEffect(() => {
    if (places.length === 0) {
      fetchEvents(50, 100, 1, setLoading, setEvents);
    }
  }, [places]);

  if (!center) return <p>Loading map...</p>;

  return (
    <MapContainer center={center} zoom={13} className="h-[1fr] w-[100%] ">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy;"
      />

      <TempMapCenterUpdater />
      <MapCenterUpdater />
      <MapClickHandler disabled={stopsCoords.length > 0 || (route.length > 0 && lineDrawn && stopsCoords.length === 0)} />

      <FilterEventsByBounds
        events={eventss}
        setFilteredEvents={setFilteredEvents}
      />

      {/*<FilterPlacesByBounds
          places={filteredPlaces}
          setFilteredPlaces={setFilteredPlaces}
          selectedCategory={selectedOption}
      /> */}

      <FilterLocationsByBounds
        events={filteredEvents}
        places={filteredPlaces}
        setFilteredEvents={setFilteredEvents}
        setFilteredPlaces={setFilteredPlaces}
      />

      {/*TEMP TEMP TEMP*/}
      <MarkerClusterGroup>
        {filteredEvents.map((event, index) => {
          const { lat, lng, title, image } = event;
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              icon={L.divIcon({
                className: 'fa-marker',
                html: `<i class="fas fa-map-marker-alt" style="color: purple; font-size: 24px;"></i>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
              eventHandlers={{
                click: () => handleEventMarkerClick(lat, lng),
              }}
            >
              <Popup className="text-center max-w-[150px]">
                <div className="flex flex-col items-start w-full">
                  {image?.large || image?.medium || image?.small ? (
                    <div className="w-full overflow-hidden rounded-md mb-1">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-[60px] object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <p className="text-darkDark text-xs mb-1">
                      No image available
                    </p>
                  )}

                  <div className="flex flex-col m-1 w-full">
                    <strong className="text-darkDark text-xs font-semibold p-0 m-0">
                      {title}
                    </strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {[
        ...places,
        ...events.map((event) => ({
          lng: event.lng,
          title: event.title,
          image: event.image,
          ...event,
        })),
      ]
        .filter((place) => !isNaN(place.lat) && !isNaN(place.lng))
        .map((place, index) => (
          <Marker
            key={index}
            position={[place.lat, place.lng]}
            eventHandlers={{
              click: () => handleEventMarkerClick(place.lat, place.lng),
            }}
          >
            <Popup className="text-center max-w-[150px] p-0 m-0">
              <div className="flex flex-col items-start w-full p-0 m-0">
                {/* Om det är ett event (dvs. place.image finns), visa event-texten */}
                {place.image && (
                  <p className="text-darkDark text-xs font-bold p-0 m-0 leading-none">
                    Detta är ett event
                  </p>
                )}

                {/* Visa bild endast om det är ett event (platsen har en bild) */}
                {place.image && (
                  <div className="w-full overflow-hidden rounded-md mb-0 p-0 m-0">
                    <img
                      src={place.image}
                      alt={place.title}
                      className="w-full h-[60px] object-cover rounded-md p-0 m-0"
                    />
                  </div>
                )}

                {/* Om det inte är ett event, visa bara titel */}
                <div className="flex flex-col w-full p-0 m-0">
                  <strong className="text-darkDark text-xs font-normal p-0 m-0">
                    {place.title}
                  </strong>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      <Marker position={center}>
        <Popup>Your current location</Popup>
      </Marker>

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
      {/* Gray segment */}
      {firstSegmentLength > 0 && (
        <Polyline
          positions={route.slice(0, firstSegmentLength)}
          color="gray"
          weight={5}
          opacity={1}
        />
      )}
      
      {/* Colored segment */}
      <Polyline
        positions={route.slice(firstSegmentLength - 1)}
        color="#0089e7"
        weight={5}
        opacity={1}
      />
      {markers
      .filter((marker) => 
        !(route.length > firstSegmentLength && 
          (
            (marker[0] === route[firstSegmentLength - 1][0] && marker[1] === route[firstSegmentLength - 1][1]) || 
            (marker[0] === route[route.length - 1][0] && marker[1] === route[route.length - 1][1])
          )
        )
      )
      .map((position, idx, filteredMarkers) => (
        <Marker key={`marker-${idx}`} position={position}>
          <Tooltip permanent>
            {idx === 0
              ? "START"
              : idx === filteredMarkers.length - 1
              ? "STOP"
              : `Marker ${idx + 1}`}
          </Tooltip>
        </Marker>
      ))}
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
