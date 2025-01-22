import { useLocationStore } from '../../store/useLocationStore';

const TriggerActionBtn = () => {
  const { lineDrawn, setLineDrawn, setMarkers, toAddress } = useLocationStore();

  const parseCoordinates = (address: string) => {
    if (!address) return null;
    
    const coords = address.split(',').map(str => str.trim());
    if (coords.length === 2 && !isNaN(Number(coords[0])) && !isNaN(Number(coords[1]))) {
      return coords.map(coord => Number(coord)) as [number, number];
    }

    return null;
  };

 
  const toCoordinates = parseCoordinates(toAddress);
  
  const handleClick = () => {
    console.log('Button clicked. Line drawn:', lineDrawn);
    
    if (toCoordinates) {
      console.log('Using "To" address coordinates:', toCoordinates);
    } else {
      console.log('Invalid coordinates for "To" address.');
    }

    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]); 
      console.log('Line and markers removed.');
    } else {
      setLineDrawn(true);
      if (toCoordinates) {
        setMarkers([toCoordinates]);
        console.log('Marker added at "To" address coordinates.');
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