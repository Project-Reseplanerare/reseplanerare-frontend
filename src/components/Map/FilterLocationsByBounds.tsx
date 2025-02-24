// React imports
import { useEffect, useCallback, useRef } from 'react';
// Leaflet imports
import { useMap } from 'react-leaflet';
// interfaces import
import { FilterLocationsByBoundsProps } from '../../interfaces/mapInterfaces/locationsByBounds_interfaces';

export const FilterLocationsByBounds: React.FC<
  FilterLocationsByBoundsProps
> = ({ events, places, setFilteredEvents, setFilteredPlaces }) => {
  const map = useMap();
  const timeoutRef = useRef<number>();

  const updateFilteredLocations = useCallback(() => {
    const bounds = map.getBounds();

    if (events?.length && setFilteredEvents) {
      setFilteredEvents(
        events.filter((event) => bounds.contains([event.lat, event.lng]))
      );
    }

    if (places?.length && setFilteredPlaces) {
      setFilteredPlaces(
        places.filter((place) => bounds.contains([place.lat, place.lng]))
      );
    }
  }, [map, events, places, setFilteredEvents, setFilteredPlaces]);

  useEffect(() => {
    const debouncedUpdate = () => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(updateFilteredLocations, 200);
    };

    map.on('moveend', debouncedUpdate);

    return () => {
      map.off('moveend', debouncedUpdate);
      window.clearTimeout(timeoutRef.current);
    };
  }, [map, updateFilteredLocations]);

  return null;
};
