// Define the types at the top of the file
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

  const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY
  
  // Function to fetch nearby bus stops
  export const fetchNearbyBusStops = async (
    center: [number, number] | null,
    setLoading: (loading: boolean) => void,
    setStops: (stops: StopLocation[]) => void
  ): Promise<void> => {
    if (center) {
      setLoading(true);
      try {
        const [latitude, longitude] = center;
        const response = await fetch(
          `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json&accessId=${apiKey}&maxNo=20`
        );
        const data: FetchStopsResponse = await response.json();
        const stops = data.stopLocationOrCoordLocation
          .map((item) => item.StopLocation)
          .filter((stop) => {
            // Bus stop seems to have cls 128
            return stop.productAtStop.some((product) => product.cls === "128" || product.cls === "8");
          });
        setStops(stops);
      } catch (error) {
        console.error("Failed to fetch stops:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Function to fetch nearby train stops
  export const fetchNearbyTrains = async (
    center: [number, number] | null,
    setLoading: (loading: boolean) => void,
    setStops: (stops: StopLocation[]) => void
  ): Promise<void> => {
    if (center) {
      setLoading(true);
      try {
        const [latitude, longitude] = center;
        const response = await fetch(
          `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json&accessId=${apiKey}`
        );
        const data: FetchStopsResponse = await response.json();
        const stops = data.stopLocationOrCoordLocation
          .map((item) => item.StopLocation)
          .filter((stop) => {
            // Train stop has cls 8
            return stop.productAtStop.some(
              (product) => product.cls === "16" || product.cls === "2"
            );
          });
        setStops(stops);
      } catch (error) {
        console.error("Failed to fetch stops:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  