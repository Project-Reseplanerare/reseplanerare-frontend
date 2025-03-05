//productsatstop interface
export interface ProductAtStop {
  cls: string;
}
//stoplocation interface
export interface StopLocation {
  id: string;
  name: string;
  productAtStop: ProductAtStop[];
}
//stoplocationresponse interface
export interface StopLocationResponse {
  StopLocation: StopLocation;
}
//fetchstopsresponse interface
export interface FetchStopsResponse {
  stopLocationOrCoordLocation: StopLocationResponse[];
}
