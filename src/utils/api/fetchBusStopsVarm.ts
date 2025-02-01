const apiKey = import.meta.env.VITE_TRAFIKLAB_KEY;

export const fetchStops = async (searchString: string, maxResults = 10, lang = 'sv') => {
    const baseUrl = "https://api.resrobot.se/v2.1/location.name";
    const url = `${baseUrl}?input=${encodeURIComponent(searchString)}&format=json&accessId=${apiKey}&maxNo=${maxResults}&lang=${lang}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        const stopLocations = data.stopLocationOrCoordLocation.map((item: { StopLocation: any; }) => item.StopLocation);

        return stopLocations || [];
    } catch (error) {
        console.error("Error fetching stops:", error);
        return [];
    }
};
