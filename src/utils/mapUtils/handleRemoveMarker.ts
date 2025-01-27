
export const handleRemoveMarker = (
  index: number, 
  lineDrawn: boolean, 
  setMarkers: React.Dispatch<React.SetStateAction<any[]>>, 
  setToAddress: React.Dispatch<React.SetStateAction<string>>, 
  setLineDrawn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!lineDrawn) {
    setMarkers((prev) => {
      const newMarkers = prev.filter((_, i) => i !== index);
      if (newMarkers.length === 0) setToAddress('');
      return newMarkers;
    });
  } else {
    setLineDrawn(false);
    setMarkers([]);
    setToAddress('');
  }
};