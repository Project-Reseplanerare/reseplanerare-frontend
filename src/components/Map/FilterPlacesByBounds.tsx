import { useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';

export interface Place {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

export interface FilterPlacesByBoundsProps {
  places: Place[];
  setFilteredPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
  selectedCategory: string | null;
}

const FilterPlacesByBounds: React.FC<FilterPlacesByBoundsProps> = ({
  places,
  setFilteredPlaces,
}) => {
  const map = useMap();
  const timeoutRef = useRef<number>();

  const updateFilteredPlaces = useCallback(() => {
    if (!places || places.length === 0) {
      return;
    }

    const bounds = map.getBounds();
    const filtered = places.filter((place) => {
      if (place.lat && place.lng) {
        return bounds.contains([place.lat, place.lng]);
      }
      return false;
    });

    setFilteredPlaces(filtered);
  }, [map, places, setFilteredPlaces]);

  useEffect(() => {
    const debouncedUpdate = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(updateFilteredPlaces, 200);
    };

    debouncedUpdate();
    map.on('moveend', debouncedUpdate);

    return () => {
      map.off('moveend', debouncedUpdate);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [map, updateFilteredPlaces]);

  return null;
};

export default FilterPlacesByBounds;
