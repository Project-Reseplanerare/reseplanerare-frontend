import { useLocationStore } from '../../store/useLocationStore';

const TriggerActionBtn = () => {
  const { lineDrawn, setLineDrawn, setMarkers, toAddress, setToAddress } =
    useLocationStore();

  const parseCoordinates = (address: string): [number, number] | null => {
    if (!address) return null;
    const coords = address.split(',').map((str) => str.trim());
    return coords.length === 2 &&
      !isNaN(Number(coords[0])) &&
      !isNaN(Number(coords[1]))
      ? (coords.map(Number) as [number, number])
      : null;
  };

  const geocodeAddress = async (
    address: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );
      const [result] = await response.json();
      return result ? [parseFloat(result.lat), parseFloat(result.lon)] : null;
    } catch {
      return null;
    }
  };

  const handleClick = async () => {
    const coordinates =
      parseCoordinates(toAddress) || (await geocodeAddress(toAddress));

    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]);
      setToAddress('');
    } else {
      setLineDrawn(true);
      if (coordinates) setMarkers([coordinates]);
    }
  };

  const isDisabled = !toAddress && !lineDrawn;

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md text-white  
        ${
          lineDrawn
            ? 'bg-slate-500 hover:bg-slate-600'
            : 'bg-slate-700 hover:bg-slate-800'
        } 
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      {lineDrawn ? 'Sluta sök' : 'Sök'}
    </button>
  );
};

export default TriggerActionBtn;
