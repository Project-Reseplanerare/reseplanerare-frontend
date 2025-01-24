import React, { useState } from "react";
import Date from "../../assets/Date.svg";

const DatePickerComponent: React.FC = () => {
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
        <div className="flex items-center gap-2">
          {/* Almanacka-ikonen */}
          <img src={Date} alt="Date Icon" className="w-6 h-6" />
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Noto Serif, serif" }}
          >
            När planerar du att resa?
          </h2>
        </div>
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
          <span className="text-sm cursor-pointer text-black"></span>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Innehåll visas här när dropdown är öppen */}
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
