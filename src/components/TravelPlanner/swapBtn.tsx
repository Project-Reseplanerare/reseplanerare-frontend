interface SwapBtnProps {
  isDisabled: boolean;
  onClick: () => void;
}

const SwapBtn: React.FC<SwapBtnProps> = ({ isDisabled, onClick }) => {
  return (
    <button
      className={`flex items-center hover:scale-105 transition-transform justify-center rounded-full h-10 w-10 border focus:outline-none 
          ${isDisabled ? '' : 'bg-blueLight text-lightLight'}`}
      onClick={onClick}
      aria-label="Swap addresses"
      title="Swap addresses"
      disabled={isDisabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    </button>
  );
};

export default SwapBtn;
