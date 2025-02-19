import { useLocationStore } from '../../store/useLocationStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';
import { useRouteStopStore } from '../../store/useRouteStopStore';
import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';

const TriggerActionBtn = () => {
  const {
    lineDrawn,
    setLineDrawn,
    setMarkers,
    fromAddress,
    toAddress,
    setTempCenter,
  } = useLocationStore();

  const { setIsButtonClicked } = useSearchBtnStore();
  const { setStopsCoords, setRouteMarkers } = useRouteStopStore();
  const { selectedOption } = useTravelOptionsStore();

  const parseCoordinates = (address: string): [number, number] | null => {
    if (!address) return null;
    const coords = address.split(',').map(Number);
    return coords.length === 2 && coords.every((n) => !isNaN(n))
      ? (coords as [number, number])
      : null;
  };

  const geocodeAddress = async (
    address: string
  ): Promise<[number, number] | null> => {
    if (!address) return null;
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
    const fromCoords =
      parseCoordinates(fromAddress) || (await geocodeAddress(fromAddress));
    const toCoords =
      parseCoordinates(toAddress) || (await geocodeAddress(toAddress));

    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]);
      setIsButtonClicked(false);
      setStopsCoords([]);
      setRouteMarkers([]);
      return;
    }

    setLineDrawn(true);
    setIsButtonClicked(true);

    if (fromCoords) setTempCenter(fromCoords);

    if (selectedOption === 'Buss') {
      setRouteMarkers(
        [fromCoords, toCoords].filter(Boolean).map((coords) => ({ coords }))
      );
    } else {
      setMarkers([fromCoords, toCoords].filter(Boolean));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 w-full hover:scale-105 transition-transform items-center rounded-md text-lightLight bg-blueLight ${
        !fromAddress && !toAddress && !lineDrawn
          ? 'opacity-50 cursor-not-allowed'
          : ''
      }`}
      disabled={!fromAddress && !toAddress && !lineDrawn}
    >
      {lineDrawn ? 'Sluta sök' : 'Sök'}
    </button>
  );
};

export default TriggerActionBtn;
