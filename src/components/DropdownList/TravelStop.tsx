import { useState } from "react";
import electricpump from "../../assets/electricpump.png";
import gaspump from "../../assets/gaspump.png";

const TravelStop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 max-w-screen-lg w-full mx-auto shadow-md">
      <div
        className="flex items-center justify-between w-full cursor-pointer"
        onClick={toggleDropdown}
      >
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "Noto Serif, serif" }}
        >
          Resestopp
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className="text-sm cursor-pointer text-black">
            {isOpen ? "Dölj lista" : "Visa lista"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex items-center justify-start space-x-4">
          {/* electricpump */}
          <div className="flex-shrink-0">
            <img src={electricpump} alt="electricpump" className="object-contain" />
          </div>

          {/* gaspump */}
          <div className="flex-shrink-0">
            <img src={gaspump} alt="gaspump" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelStop;