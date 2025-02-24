export interface ProductAtStop {
  cls: string;
}

export interface StopLocation {
  id: string;
  name: string;
  productAtStop: ProductAtStop[];
}

export interface StopLocationResponse {
  StopLocation: StopLocation;
}

export interface FetchStopsResponse {
  stopLocationOrCoordLocation: StopLocationResponse[];
}
