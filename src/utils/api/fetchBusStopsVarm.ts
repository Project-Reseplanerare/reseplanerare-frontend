//trafiklab api key
const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

export const fetchBusStops = async (
  searchString: string,
  maxResults = 3,
  lang = 'sv'
) => {
  const baseUrl = import.meta.env.VITE_STOPS_LOOKUP_API;
  const url = `${baseUrl}?input=${encodeURIComponent(
    searchString
  )}&format=json&accessId=${apiKey}&maxNo=${maxResults}&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return data.stopLocationOrCoordLocation
      .filter(
        (item: any) =>
          item.StopLocation &&
          item.StopLocation.productAtStop?.some(
            (product: any) => product.cls === '8' || product.cls === '128'
          )
      )
      .map((item: any) => ({
        name: item.StopLocation.name,
        extId: item.StopLocation.extId,
        lon: item.StopLocation.lon,
        lat: item.StopLocation.lat,
      }));
  } catch (error) {
    console.error('Error fetching stops:', error);
    return [];
  }
};
