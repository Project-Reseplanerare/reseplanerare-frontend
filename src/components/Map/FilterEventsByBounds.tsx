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

const FilterEventsByBounds: React.FC<FilterEventsByBoundsProps> = ({
 events,
 setFilteredEvents,
}) => {
 const map = useMap();
 const timeoutRef = useRef<number>();

 const updateFilteredEvents = useCallback(() => {
   const bounds = map.getBounds();
   const filtered = events.filter((event) =>
     bounds.contains([event.lat, event.lng])
   );
   setFilteredEvents(filtered);
 }, [map, events, setFilteredEvents]);

 useEffect(() => {
   const debouncedUpdate = () => {
     if (timeoutRef.current) {
       window.clearTimeout(timeoutRef.current);
     }
     timeoutRef.current = window.setTimeout(updateFilteredEvents, 100);
   };

   debouncedUpdate();
   map.on('moveend', debouncedUpdate);

   return () => {
     map.off('moveend', debouncedUpdate);
     if (timeoutRef.current) {
       window.clearTimeout(timeoutRef.current);
     }
   };
 }, [map, updateFilteredEvents]);

 return null;
};

export default FilterEventsByBounds;