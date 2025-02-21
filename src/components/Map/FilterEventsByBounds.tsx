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
  const timeoutRef = useRef<number>(0);

  const updateFilteredEvents = useCallback(() => {
    if (!map) return;
    const bounds = map.getBounds();
    setFilteredEvents(
      events.filter((event) => bounds.contains([event.lat, event.lng]))
    );
  }, [map, events, setFilteredEvents]);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(updateFilteredEvents, 100);
  }, [updateFilteredEvents]);

  useEffect(() => {
    if (!map) return;
    map.on('moveend', debouncedUpdate);
    return () => {
      map.off('moveend', debouncedUpdate);
      window.clearTimeout(timeoutRef.current);
    };
  }, [map, debouncedUpdate]);

  return null;
};
