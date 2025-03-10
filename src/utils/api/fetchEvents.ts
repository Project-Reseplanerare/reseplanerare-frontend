//trafiklab events api endpoint
const EVENTS_API = import.meta.env.VITE_EVENTS_API;

export const fetchEvents = async (
  limit: number,
  totalEvents: number,
  page: number,
  setLoading: (loading: boolean) => void,
  setEvents: (
    events: {
      lat: number;
      lng: number;
      title: string;
      description: string;
      image: string | null;
    }[]
  ) => void
) => {
  try {
    const allEvents: {
      lat: number;
      lng: number;
      title: string;
      description: string;
      image: string | null;
    }[] = [];
    let eventsFetched = 0;

    setLoading(true);

    while (eventsFetched < totalEvents) {
      const response = await fetch(`${EVENTS_API}?limit=${limit}&page=${page}`);
      if (!response.ok) break;

      const data = await response.json();
      const eventMarkers = data.data.map((event: any) => {
        const place = event.places?.[0] || {};
        return {
          lat: parseFloat(place.latitude) || 0,
          lng: parseFloat(place.longitude) || 0,
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
