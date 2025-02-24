export interface Stop {
  lon: number;
  lat: number;
  extId: string;
  name: string;
  depTime?: string;
  arrTime?: string;
}

export interface TripLeg {
  Stops?: { Stop: Stop[] };
  Product?: { catOut: string }[];
}

export interface Trip {
  LegList?: { Leg: TripLeg[] };
}

export interface ApiResponse {
  Trip?: Trip[];
}
