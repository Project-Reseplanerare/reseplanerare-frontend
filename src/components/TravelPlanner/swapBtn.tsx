import { motion } from 'framer-motion';

interface SwapBtnProps {
  isDisabled: boolean;
  onClick: () => void;
}

export const SwapBtn: React.FC<SwapBtnProps> = ({ isDisabled, onClick }) => (
  <motion.button
    className={`grid place-items-center rounded-full h-10 w-10 border focus:outline-none transition-transform hover:scale-105 ${isDisabled ? '' : 'bg-blueLight text-lightLight'
      }`}
    onClick={onClick}
    aria-label="Swap addresses"
    title="Swap addresses"
    disabled={isDisabled}
    whileTap={!isDisabled ? { rotate: 180, scale: 1 } : {}}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      initial={{ rotate: 0 }}
      animate={{ rotate: 0 }}
      whileTap={!isDisabled ? { rotate: 180 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
      />
    </motion.svg>
  </motion.button>
);
