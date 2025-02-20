const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';
const BASE_API = 'https://turid.visitvarmland.com/api/v8/products';

// satt ihop en funktion som tar emot lat och lng som strängar och returnerar ett objekt med lat och lng som nummer
const parseCoordinates = (lat: string | number | null | undefined, lng: string | number | null | undefined) => {
  const parsedLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  const parsedLng = typeof lng === 'string' ? parseFloat(lng) : lng;

  // Om lat eller lng är ogiltiga eller saknas, sätt dem till 0
  return {
    lat: (isNaN(parsedLat) || parsedLat === undefined || parsedLat === null) ? 0 : parsedLat,
    lng: (isNaN(parsedLng) || parsedLng === undefined || parsedLng === null) ? 0 : parsedLng,
  };
};

export const fetchEvents = async (limit: number, totalEvents: number, page: number, setLoading: Function, setEvents: Function) => {
  try {
    const allEvents: any[] = [];
    let eventsFetched = 0;

    setLoading(true);

    while (eventsFetched < totalEvents) {
      const response = await fetch(`${EVENTS_API}?limit=${limit}&page=${page}`);
      if (!response.ok) break;

      const data = await response.json();
      const eventMarkers = data.data.map((event: any) => {
        const place = event.places?.[0] || {};
        const { lat, lng } = parseCoordinates(place.latitude, place.longitude);

        return {
          lat,
          lng,
          title: event.title || 'Unknown Event',
          description: event.sales_text || 'No description available',
          image: event.images?.[0]?.medium || null,
        };
      });

      allEvents.push(...eventMarkers);
      eventsFetched += eventMarkers.length;
      page += 1;

      if (eventMarkers.length < limit) break;
    }

    setEvents(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    setLoading(false);
  }
};


export const fetchProductsByCategory = async (category: string, limit: number, page: number) => {
    try {
        const response = await fetch(`${BASE_API}?categories=${category}&limit=${limit}&page=${page}`);
        if (!response.ok) throw new Error(`Failed to fetch ${category}`);

        const data = await response.json();
        return data.data.map((product: any) => ({
            lat: parseFloat(product.latitude) || 0,
            lng: parseFloat(product.longitude) || 0,
            title: product.name || 'Unknown Product',
            description: product.description || 'No description available',
        }));
    } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return [];
    }
};

export const fetchFoodDrinks = async (limit: number, page: number) => {
    return fetchProductsByCategory('mat-dryck', limit, page);
};

export const fetchCultureHistory = async (limit: number, page: number) => {
    return fetchProductsByCategory('kultur-historia', limit, page);
};

export const fetchDesignShopping = async (limit: number, page: number) => {
    return fetchProductsByCategory('design-shopping', limit, page);
};

export const fetchAccommodation = async (limit: number, page: number) => {
    return fetchProductsByCategory('boende', limit, page);
};

export const fetchActivities = async (limit: number, page: number) => {
    return fetchProductsByCategory('aktiviteter', limit, page);
};
