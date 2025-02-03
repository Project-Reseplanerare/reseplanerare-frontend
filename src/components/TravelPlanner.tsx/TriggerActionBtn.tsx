import { useLocationStore } from '../../store/useLocationStore';
import { useSearchBtnStore } from '../../store/useSearchBtnStore';

const TriggerActionBtn = () => {
  const { 
    lineDrawn, setLineDrawn, setMarkers, 
    fromAddress, toAddress, 
    setTempCenter 
  } = useLocationStore();
  
  const { setIsButtonClicked } = useSearchBtnStore(); 

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
    const fromCoordinates =
      parseCoordinates(fromAddress) || (await geocodeAddress(fromAddress));
    const toCoordinates =
      parseCoordinates(toAddress) || (await geocodeAddress(toAddress));

    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]);
      setIsButtonClicked(false); // Set to false when "Sluta sök" is clicked
    } else {
      setLineDrawn(true);
      const newMarkers = [];
      if (fromCoordinates) newMarkers.push(fromCoordinates);
      if (toCoordinates) newMarkers.push(toCoordinates);
      setMarkers(newMarkers);

      // Always set tempCenter to fromCoordinates (if available)
      if (fromCoordinates) {
        setTempCenter(fromCoordinates);
      }
      setIsButtonClicked(true); // Set to true when "Sök" is clicked
    }
  };

  const isDisabled = !fromAddress && !toAddress && !lineDrawn;

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

// import { useLocationStore } from '../../store/useLocationStore';

// const TriggerActionBtn = () => {
//   const { lineDrawn, setLineDrawn, setMarkers, toAddress, setToAddress, markers } = useLocationStore();

//   const parseCoordinates = (address: string) => {
//     if (!address) return null;
//     const coords = address.split(',').map((str) => str.trim());
//     if (
//       coords.length === 2 &&
//       !isNaN(Number(coords[0])) &&
//       !isNaN(Number(coords[1]))
//     ) {
//       return coords.map((coord) => Number(coord)) as [number, number];
//     }
//     return null;
//   };

//   const geocodeAddress = async (address: string) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//           address
//         )}&format=json&limit=1`
//       );
//       const data = await response.json();
//       if (data && data[0]) {
//         const { lat, lon } = data[0];
//         return [parseFloat(lat), parseFloat(lon)];
//       }
//       return null;
//     } catch (error) {
//       console.error('Error geocoding address:', error);
//       return null;
//     }
//   };

//   const handleClick = async () => {
//     console.log('Button clicked. Line drawn:', lineDrawn);
  
//     let coordinates = parseCoordinates(toAddress);
//     if (!coordinates) {
//       console.log('Address detected. Attempting to geocode...');
//       const geocoded = await geocodeAddress(toAddress);
//       if (geocoded && geocoded.length === 2) {
//         coordinates = [geocoded[0], geocoded[1]];
//       } else {
//         console.log('Geocoding failed, no coordinates found.');
//       }
//     }
  
//     if (coordinates) {
//       console.log('Using coordinates:', coordinates);
//     } else {
//       console.log('Invalid coordinates or geocoding failed.');
//     }
  
//     if (lineDrawn) {
//       setLineDrawn(false);
//       setMarkers([]);
//       setToAddress('');
//       console.log('Line and markers removed.');
//     } else {
//       // Check if a marker already exists at the searched coordinates
//       const markerExists = markers.some(
//         (marker) =>
//           marker[0] === coordinates[0] && marker[1] === coordinates[1]
//       );
  
//       if (!markerExists) {
//         setLineDrawn(true);
//         if (coordinates) {
//           setMarkers([coordinates]);
//           console.log('Marker added at coordinates.');
//         } else {
//           console.log('No valid coordinates to set markers.');
//         }
//       } else {
//         console.log('Marker already exists at this location.');
//       }
//     }
//   };

//   const isDisabled = !toAddress && !lineDrawn;

//   return (
//     <button
//       onClick={handleClick}
//       className={`px-4 py-2 rounded-md text-white  
//     ${
//       lineDrawn
//         ? 'bg-slate-500 hover:bg-slate-600'
//         : 'bg-slate-700 hover:bg-slate-800'
//     } 
//     ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//       disabled={isDisabled}
//     >
//       {lineDrawn ? 'Sluta sök' : 'Sök'}
//     </button>
//   );
// };

// export default TriggerActionBtn;
