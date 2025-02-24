//interface for event
export interface Event {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  image?: string | null;
}
//inteface for filtereventsbybounds
export interface FilterEventsByBoundsProps {
  events: Event[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<any[]>>;
}
