export const handleRemoveMarker = (
  index: number,
  lineDrawn: boolean,
  setMarkers: React.Dispatch<React.SetStateAction<any[]>>,
  setToAddress: React.Dispatch<React.SetStateAction<string>>,
  setLineDrawn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (typeof index !== 'number' || index < 0) {
    console.error('Invalid index provided to handleRemoveMarker:', index);
    return;
  }

  if (
    typeof setMarkers !== 'function' ||
    typeof setToAddress !== 'function' ||
    typeof setLineDrawn !== 'function'
  ) {
    console.error(
      'Invalid state setter functions provided to handleRemoveMarker.'
    );
    return;
  }

  if (lineDrawn) {
    setMarkers([]);
    setToAddress('');
    setLineDrawn(false);
    return;
  }

  setMarkers((prev) => {
    if (!Array.isArray(prev)) {
      console.error('Expected markers to be an array but received:', prev);
      return prev;
    }

    const newMarkers = prev.filter((_, i) => i !== index);
    if (newMarkers.length === 0) setToAddress('');

    return newMarkers;
  });
};
