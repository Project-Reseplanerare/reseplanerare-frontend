//import nearbystops interface
import {
  StopLocation,
  FetchStopsResponse,
} from './../../interfaces/utilsInterfaces/nearbyStops_interfaces';

//trafiklab api key
const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;
//nearbystops trafiklab key
const BASE_TRAFFIC_API = 'https://api.resrobot.se/v2.1/location.nearbystops';

const fetchNearbyStops = async (
  center: [number, number] | null,
  validCls: string[],
  setLoading: (loading: boolean) => void,
  setStops: (stops: StopLocation[]) => void
): Promise<void> => {
  if (!center) return;

  setLoading(true);
  try {
    const [latitude, longitude] = center;
    const response = await fetch(
      `${BASE_TRAFFIC_API}?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json&accessId=${apiKey}&maxNo=20`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch stops: ${response.status} ${response.statusText}`
      );
    }

    const data: FetchStopsResponse = await response.json();

    if (!Array.isArray(data.stopLocationOrCoordLocation)) {
      throw new Error('Invalid response format: Expected an array');
    }

    const stops = data.stopLocationOrCoordLocation
      .map((item) => item.StopLocation)
      .filter((stop) =>
        stop.productAtStop.some((product) => validCls.includes(product.cls))
      );

    setStops(stops);
  } catch (error) {
    console.error(`Error fetching stops: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

export const fetchNearbyBusStops = (
  center: [number, number] | null,
  setLoading: (loading: boolean) => void,
  setStops: (stops: StopLocation[]) => void
) => fetchNearbyStops(center, ['128', '8'], setLoading, setStops);

export const fetchNearbyTrains = (
  center: [number, number] | null,
  setLoading: (loading: boolean) => void,
  setStops: (stops: StopLocation[]) => void
) => fetchNearbyStops(center, ['16', '2'], setLoading, setStops);
