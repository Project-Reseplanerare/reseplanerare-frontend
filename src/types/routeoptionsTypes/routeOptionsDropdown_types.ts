
export type Departure = {
    JourneyDetailRef: { ref: string };
    ProductAtStop?: { catOut: string; name: string };
    time: string;
  };
  
 export type Arrival = {
    JourneyDetailRef: { ref: string };
    time: string;
  };
  
 export type ResponseData<T> = {
    Departure?: T[];
    Arrival?: T[];
  };
  