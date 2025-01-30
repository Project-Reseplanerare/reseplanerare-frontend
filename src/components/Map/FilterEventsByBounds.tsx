import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Event {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

interface FilterEventsByBoundsProps {
  events: Event[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const FilterEventsByBounds: React.FC<FilterEventsByBoundsProps> = ({
  events,
  setFilteredEvents,
}) => {
  const map = useMap();

  useEffect(() => {
    const updateFilteredEvents = () => {
      const bounds = map.getBounds();
      const filtered = events.filter((event) =>
        bounds.contains([event.lat, event.lng])
      );
      setFilteredEvents(filtered);
    };

    updateFilteredEvents();
    map.on('moveend', updateFilteredEvents);

    return () => {
      map.off('moveend', updateFilteredEvents);
    };
  }, [map, events, setFilteredEvents]);

  return null;
};

export default FilterEventsByBounds;
