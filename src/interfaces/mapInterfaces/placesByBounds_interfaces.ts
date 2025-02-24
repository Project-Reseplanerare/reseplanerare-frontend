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
