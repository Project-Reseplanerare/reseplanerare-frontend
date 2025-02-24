//stop interface
export interface Stop {
  lon: number;
  lat: number;
  extId: string;
  name: string;
  depTime?: string;
  arrTime?: string;
}
//tripleg interface
export interface TripLeg {
  Stops?: { Stop: Stop[] };
  Product?: { catOut: string }[];
}
//trip interface
export interface Trip {
  LegList?: { Leg: TripLeg[] };
}
//api response interface
export interface ApiResponse {
  Trip?: Trip[];
}
