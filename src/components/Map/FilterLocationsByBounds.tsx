import { useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';

export interface Event {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  image?: string | null;
}

export interface Place {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

interface FilterLocationsByBoundsProps {
  events?: Event[];
  places?: Place[];
  setFilteredEvents?: React.Dispatch<React.SetStateAction<Event[]>>;
  setFilteredPlaces?: React.Dispatch<React.SetStateAction<Place[]>>;
}

const FilterLocationsByBounds: React.FC<FilterLocationsByBoundsProps> = ({
  events,
  places,
  setFilteredEvents,
  setFilteredPlaces,
}) => {
  const map = useMap();
  const timeoutRef = useRef<number>();

  const updateFilteredLocations = useCallback(() => {
    const bounds = map.getBounds();

    // Filtrera evenemang om de finns
    if (events && setFilteredEvents) {
      const filteredEvents = events.filter((event) =>
        bounds.contains([event.lat, event.lng])
      );
      setFilteredEvents(filteredEvents);
    }

    // Filtrera platser om de finns
    if (places && setFilteredPlaces) {
      const filteredPlaces = places.filter((place) =>
        bounds.contains([place.lat, place.lng])
      );
      setFilteredPlaces(filteredPlaces);
    }
  }, [map, events, places, setFilteredEvents, setFilteredPlaces]);

  useEffect(() => {
    const debouncedUpdate = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(updateFilteredLocations, 200);
    };

    debouncedUpdate();
    map.on('moveend', debouncedUpdate);

    return () => {
      map.off('moveend', debouncedUpdate);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [map, updateFilteredLocations]);

  return null;
};

export default FilterLocationsByBounds;
