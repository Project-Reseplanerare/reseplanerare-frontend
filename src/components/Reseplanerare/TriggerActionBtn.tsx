interface TriggerActionBtnProps {
  onClick: () => void; // Function to execute on click
  className?: string; // Optional custom CSS classes
  disabled?: boolean; // Disable the button if true
}

function TriggerActionBtn({
  onClick,
  className,
  disabled = false,
}: TriggerActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${className}`}
      disabled={disabled}
    >
      Sök resa
    </button>
  );
}

export default TriggerActionBtn;
