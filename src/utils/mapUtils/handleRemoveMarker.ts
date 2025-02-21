export const handleRemoveMarker = (
  index: number,
  lineDrawn: boolean,
  setMarkers: React.Dispatch<React.SetStateAction<any[]>>,
  setToAddress: React.Dispatch<React.SetStateAction<string>>,
  setLineDrawn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Validate the index
  if (typeof index !== 'number' || index < 0) {
    console.error('Invalid index provided to handleRemoveMarker:', index);
    return;
  }

  // Ensure state setter functions are valid
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

  // If a line has been drawn, reset everything
  if (lineDrawn) {
    setMarkers([]);
    setToAddress('');
    setLineDrawn(false);
    return;
  }

  // Remove marker safely
  setMarkers((prev) => {
    if (!Array.isArray(prev)) {
      console.error('Expected markers to be an array but received:', prev);
      return prev; // Return current state to avoid breaking state updates
    }

    const newMarkers = prev.filter((_, i) => i !== index);
    if (newMarkers.length === 0) setToAddress('');

    return newMarkers;
  });
};
