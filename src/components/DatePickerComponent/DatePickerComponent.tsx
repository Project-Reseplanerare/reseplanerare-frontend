import React, { useState } from "react"; 

import DateIcon from "../../assets/close.svg"; 

 

const DatePickerComponent: React.FC = () => { 

  const [isOpen, setIsOpen] = useState(false); 

  const [selectedTime, setSelectedTime] = useState(""); // State för tid 

 

  const toggleDropdown = () => { 

    setIsOpen(!isOpen); 

  }; 

 

  // Hämta dagens datum i rätt format (YYYY-MM-DD) 

  const today = new Date().toISOString().split("T")[0]; 

 

  // Funktion för att hämta och sätta aktuell tid 

  const setCurrentTime = () => { 

    const now = new Date(); 

    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM-format 

    setSelectedTime(formattedTime); 

  }; 

 

  return ( 

    <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 max-w-screen-lg w-full mx-auto shadow-md"> 

      <div 

        className="flex items-center justify-between w-full cursor-pointer" 

        onClick={toggleDropdown} 

      > 

        <div className="flex items-center gap-2"> 

          {/* Almanacka-ikonen */} 

          <img src={DateIcon} alt="Date Icon" className="w-6 h-6" /> 

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

        <div className="mt-4 flex flex-col items-center gap-6"> 

           

          {/* Gemensam div för almanacka och tid-väljare */} 

          <div className="flex flex-col items-center gap-4 w-full max-w-md"> 

 

            {/* Almanacka */} 

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 w-full text-center"> 

              <h3 className="text-lg font-semibold mb-2">Välj datum</h3> 

              <input 

                type="date" 

                className="w-full p-2 border border-gray-400 rounded" 

                min={today} /> 

            </div> 

 

            {/* Tid-väljare */} 

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 w-full text-center"> 

              <h3 className="text-lg font-semibold mb-2">Välj tid</h3> 

 

              {/* Knapp för att välja aktuell tid */} 

              <button 

                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 

                onClick={setCurrentTime}> 

                Välj vad klockan är nu 

              </button> 

              <div className="mt-4"> 

                <label htmlFor="time" className="block mb-2"> 

                  Eller välj en tid själv: 

                </label> 

                <input 

                  type="time" 

                  id="time" 

                  className="w-full p-2 border border-gray-400 rounded" 

                  value={selectedTime} 

                  onChange={(e) => setSelectedTime(e.target.value)}  

                /> 

              </div> 

            </div> 

          </div> 

        </div> 

      )} 

    </div> 

  ); 

}; 

 

export default DatePickerComponent; 
