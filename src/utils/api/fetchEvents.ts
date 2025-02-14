const EVENTS_API = 'https://turid.visitvarmland.com/api/v8/events';

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