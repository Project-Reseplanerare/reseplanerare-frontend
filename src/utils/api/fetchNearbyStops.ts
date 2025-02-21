interface ProductAtStop {
  cls: string;
}

interface StopLocation {
  id: string;
  name: string;
  productAtStop: ProductAtStop[];
}

interface StopLocationResponse {
  StopLocation: StopLocation;
}

interface FetchStopsResponse {
  stopLocationOrCoordLocation: StopLocationResponse[];
}

const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

const BASE_TRAFFIC_API = 'https://api.resrobot.se/v2.1/location.nearbystops';

/**
 * Generic function to fetch nearby stops (bus or train)
 */
const fetchNearbyStops = async (
  center: [number, number] | null,
  validCls: string[], // List of valid `cls` values for filtering stops
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

/**
 * Fetch nearby bus stops
 */
export const fetchNearbyBusStops = (
  center: [number, number] | null,
  setLoading: (loading: boolean) => void,
  setStops: (stops: StopLocation[]) => void
) => fetchNearbyStops(center, ['128', '8'], setLoading, setStops);

/**
 * Fetch nearby train stops
 */
export const fetchNearbyTrains = (
  center: [number, number] | null,
  setLoading: (loading: boolean) => void,
  setStops: (stops: StopLocation[]) => void
) => fetchNearbyStops(center, ['16', '2'], setLoading, setStops);
