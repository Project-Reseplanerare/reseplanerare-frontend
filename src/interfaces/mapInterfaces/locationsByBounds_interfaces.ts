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
  
 export interface FilterLocationsByBoundsProps {
    events?: Event[];
    places?: Place[];
    setFilteredEvents?: React.Dispatch<React.SetStateAction<Event[]>>;
    setFilteredPlaces?: React.Dispatch<React.SetStateAction<Place[]>>;
  }