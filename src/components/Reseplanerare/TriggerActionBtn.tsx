import { useLocationStore } from '../../store/useLocationStore';

const TriggerActionBtn = () => {
  const { lineDrawn, setLineDrawn, setMarkers, setToAddress } = useLocationStore(); 

  const handleClick = () => {
    console.log('Button clicked. Line drawn:', lineDrawn);
    if (lineDrawn) {
      setLineDrawn(false);
      setMarkers([]); 
      setToAddress(''); 
      console.log('Line removed.');
    } else {
      setLineDrawn(true);
      console.log('Line drawn.');
    }
  };

  const { toAddress } = useLocationStore(); 
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