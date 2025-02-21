const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';
const BASE_API = 'https://turid.visitvarmland.com/api/v8/products';

const parseCoordinates = (
  lat: string | number | null | undefined,
  lng: string | number | null | undefined
) => {
  const parsedLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  const parsedLng = typeof lng === 'string' ? parseFloat(lng) : lng;

  return {
    lat: Number.isFinite(parsedLat) ? parsedLat : 0,
    lng: Number.isFinite(parsedLng) ? parsedLng : 0,
  };
};

export const fetchEvents = async (limit: number, page: number) => {
  try {
    const response = await fetch(`${EVENTS_API}?limit=${limit}&page=${page}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.data)) {
      throw new Error('Invalid response format: Expected an array');
    }

    const eventMarkers = data.data.map((event: any) => {
      const place = event.places?.[0] || {};
      const { lat, lng } = parseCoordinates(place.latitude, place.longitude);

      return {
        lat,
        lng,
        title: event.title?.trim() || 'Unknown Event',
        description: event.sales_text?.trim() || 'No description available',
        image: event.images?.[0]?.medium || null,
      };
    });

    return { events: eventMarkers, total: data.total || 0 };
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    return { events: [], total: 0 };
  }
};

export const fetchCategoryProducts = async (
  category: string,
  limit: number,
  page: number
) => {
  try {
    const response = await fetch(
      `${BASE_API}?categories=${encodeURIComponent(
        category
      )}&limit=${limit}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch category "${category}": ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.data)) {
      throw new Error(
        `Invalid response format: Expected an array for category "${category}"`
      );
    }

    const products = data.data.map((product: any) => {
      const { lat, lng } = parseCoordinates(
        product.latitude,
        product.longitude
      );

      return {
        lat,
        lng,
        title: product.name?.trim() || 'Unknown Product',
        description: product.description?.trim() || 'No description available',
      };
    });

    return { products, total: data.total || 0 };
  } catch (error) {
    console.error(`Error fetching category "${category}": ${error.message}`);
    return { products: [], total: 0 };
  }
};

const createCategoryFetcher = (category: string) => {
  return (limit: number, page: number) =>
    fetchCategoryProducts(category, limit, page);
};

export const fetchFoodDrinks = createCategoryFetcher('mat-dryck');
export const fetchCultureHistory = createCategoryFetcher('kultur-historia');
export const fetchDesignShopping = createCategoryFetcher('design-shopping');
export const fetchAccommodation = createCategoryFetcher('boende');
export const fetchActivities = createCategoryFetcher('aktiviteter');
