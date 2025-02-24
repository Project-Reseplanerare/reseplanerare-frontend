// Departure
export type Departure = {
  JourneyDetailRef: { ref: string };
  ProductAtStop?: { catOut: string; name: string };
  time: string;
};

// Arrival
export type Arrival = {
  JourneyDetailRef: { ref: string };
  time: string;
};

// ResponseData
export type ResponseData<T> = {
  Departure?: T[];
  Arrival?: T[];
};
