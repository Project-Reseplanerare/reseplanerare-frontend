import { useLocationStore } from '../../store/useLocationStore';

const TriggerActionBtn = () => {
  const { lineDrawn, setLineDrawn, setMarkers, toAddress } = useLocationStore();

  // Function to parse coordinates from the string (latitude,longitude format)
  const parseCoordinates = (address: string) => {
    if (!address) return null;

    const coords = address.split(',').map((str) => str.trim());
    if (
      coords.length === 2 &&
      !isNaN(Number(coords[0])) &&
      !isNaN(Number(coords[1]))
    ) {
      return coords.map((coord) => Number(coord)) as [number, number];
    }

    return null;
  };

  // Geocoding function to get coordinates from an address
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data[0]) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  const handleClick = async () => {
    console.log('Button clicked. Line drawn:', lineDrawn);

    let coordinates = parseCoordinates(toAddress);
    if (!coordinates) {
      console.log('Address detected. Attempting to geocode...');
      const geocoded = await geocodeAddress(toAddress);
      if (geocoded && geocoded.length === 2) {
        coordinates = [geocoded[0], geocoded[1]];
      } else {
        console.log('Geocoding failed, no coordinates found.');
      }
    }

    if (coordinates) {
      console.log('Using coordinates:', coordinates);
    } else {
      console.log('Invalid coordinates or geocoding failed.');
    }

    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]);
      console.log('Line and markers removed.');
    } else {
      setLineDrawn(true);
      if (coordinates) {
        setMarkers([coordinates]);
        console.log('Marker added at coordinates.');
      } else {
        console.log('No valid coordinates to set markers.');
      }
    }
  };

  const isDisabled = !toAddress;

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md text-white  
        ${lineDrawn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      {lineDrawn ? 'Sluta sök' : 'Sök'}
    </button>
  );
};

export default TriggerActionBtn;
