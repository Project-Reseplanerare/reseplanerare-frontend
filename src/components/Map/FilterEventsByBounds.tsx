import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface FilterEventsByBoundsProps {
  events: any[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

const FilterEventsByBounds: React.FC<FilterEventsByBoundsProps> = ({ events, setFilteredEvents }) => {
  const map = useMap();

  useEffect(() => {
    const updateFilteredEvents = () => {
      const bounds = map.getBounds();
      const filtered = events.filter((event: any) =>
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