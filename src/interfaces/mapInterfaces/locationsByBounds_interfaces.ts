//interface for event
export interface Event {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  image?: string | null;
}
//interface for Place
export interface Place {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}
//interface forFilterlocationbybounds
export interface FilterLocationsByBoundsProps {
  events?: Event[];
  places?: Place[];
  setFilteredEvents?: React.Dispatch<React.SetStateAction<Event[]>>;
  setFilteredPlaces?: React.Dispatch<React.SetStateAction<Place[]>>;
}
