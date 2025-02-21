const API_KEY = import.meta.env.VITE_TRAFIKLAB_KEY;
const BASE_TRAIN_API = 'https://api.resrobot.se/v2.1/location.name';

/**
 * Fetch train stops based on a search query.
 */
export const fetchTrainStops = async (
  searchString: string,
  maxResults = 3,
  lang = 'sv'
) => {
  if (!searchString.trim()) {
    console.warn('fetchTrainStops: Empty search string provided.');
    return [];
  }

  const url = `${BASE_TRAIN_API}?input=${encodeURIComponent(
    searchString
  )}&format=json&accessId=${API_KEY}&maxNo=${maxResults}&lang=${lang}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.stopLocationOrCoordLocation)) {
      throw new Error('Invalid response format: Expected an array.');
    }

    const trainStops = data.stopLocationOrCoordLocation
      .filter(
        (item: any) =>
          item.StopLocation &&
          Array.isArray(item.StopLocation.productAtStop) &&
          item.StopLocation.productAtStop.some(
            (product: any) => product.cls === '16' || product.cls === '2'
          )
      )
      .map((item: any) => ({
        name: item.StopLocation.name?.trim() || 'Unknown Stop',
        extId: item.StopLocation.extId,
        lon: Number.isFinite(item.StopLocation.lon) ? item.StopLocation.lon : 0,
        lat: Number.isFinite(item.StopLocation.lat) ? item.StopLocation.lat : 0,
      }));

    return trainStops;
  } catch (error) {
    console.error('Error fetching train stops:', (error as Error).message);
    return [];
  }
};
