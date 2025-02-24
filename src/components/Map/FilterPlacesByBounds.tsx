// deafult react imports
import { useEffect, useCallback, useRef } from 'react';
//react-leaflet import
import { useMap } from 'react-leaflet';
// interface import
import { FilterPlacesByBoundsProps } from './../../interfaces/mapInterfaces/placesByBounds_interfaces';

export const FilterPlacesByBounds: React.FC<FilterPlacesByBoundsProps> = ({
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
