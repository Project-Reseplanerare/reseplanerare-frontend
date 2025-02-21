import { useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';

interface Event {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  image?: string | null;
}

interface FilterEventsByBoundsProps {
  events: Event[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FilterEventsByBounds: React.FC<FilterEventsByBoundsProps> = ({
  events,
  setFilteredEvents,
}) => {
  const map = useMap();
  const timeoutRef = useRef<number | null>(null);

  const updateFilteredEvents = useCallback(() => {
    const bounds = map.getBounds();
    setFilteredEvents(
      events.filter((event) => bounds.contains([event.lat, event.lng]))
    );
  }, [map, events, setFilteredEvents]);

  useEffect(() => {
    const debouncedUpdate = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(updateFilteredEvents, 100);
    };

    map.on('moveend', debouncedUpdate);

    return () => {
      map.off('moveend', debouncedUpdate);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [map, updateFilteredEvents]);

  return null;
};
