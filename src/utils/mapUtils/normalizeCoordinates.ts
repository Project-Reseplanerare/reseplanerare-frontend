export const normalizeCoordinates = (lat: any, lng: any) => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    return isNaN(parsedLat) || isNaN(parsedLng)
      ? null
      : { lat: parsedLat, lng: parsedLng };
  };
  