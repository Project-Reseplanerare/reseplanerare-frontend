const REVERSE_GEOCODE_API = 'https://nominatim.openstreetmap.org/reverse';

type SetAddressFunction = (address: string) => void;

export const fetchAddress = async (
  lat: number, 
  lng: number, 
  type: 'from' | 'to', 
  setFromAddress: SetAddressFunction, 
  setToAddress: SetAddressFunction
): Promise<void> => {
  try {
    const response = await fetch(`${REVERSE_GEOCODE_API}?lat=${lat}&lon=${lng}&format=json`);
    if (response.ok) {
      const data = await response.json();
      const address = data.display_name || 'Unknown address';
      if (type === 'from') setFromAddress(address);
      else setToAddress(address);
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};