import { useTravelOptionsStore } from '../../store/useTravelOptionsStore';

const TravelOptions: React.FC = () => {
  const { selectedOption, setSelectedOption } = useTravelOptionsStore();

  const options = [ 'Bil', 'Buss', 'Tåg'];

  return (
    <div className="flex flex-col items-start gap-4 font-sans">
      <label className="text-sm font-bold">Resealternativ</label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="radio"
              name="travelOption"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="form-radio h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TravelOptions;

// import React, { useState } from "react"; 

// import Bus from "../../assets/close.svg"; 

// import Train from "../../assets/close.svg"; 

 

// const TravelOptions: React.FC = () => { 

//   const [isOpen, setIsOpen] = useState(false); 

 

//   const toggleDropdown = () => { 

//     setIsOpen(!isOpen); 

//   }; 

 

//   return ( 

//     <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 max-w-screen-lg w-full mx-auto shadow-md"> 

//       <div 

//         className="flex items-center justify-between w-full cursor-pointer" 

//         onClick={toggleDropdown} 

//       > 

//         <h2 

//           className="text-xl font-bold" 

//           style={{ fontFamily: "Noto Serif, serif" }} 

//         > 

//           Hur planerar du att resa? 

//         </h2> 

//         <div className="flex items-center space-x-2"> 

//           <div 

//             className={`transform transition-transform ${ 

//               isOpen ? "rotate-180" : "rotate-0" 

//             }`} 

//           > 

//             <svg 

//               xmlns="http://www.w3.org/2000/svg" 

//               fill="none" 

//               viewBox="0 0 24 24" 

//               stroke="currentColor" 

//               className="w-6 h-6 text-gray-600" 

//             > 

//               <path 

//                 strokeLinecap="round" 

//                 strokeLinejoin="round" 

//                 strokeWidth={2} 

//                 d="M19 9l-7 7-7-7" 

//               /> 

//             </svg> 

//           </div> 

//           <span className="text-sm cursor-pointer text-black"> 

//             {isOpen ? "Dölj lista" : "Visa lista"} 

//           </span> 

//         </div> 

//       </div> 

 

//       {isOpen && ( 

//         <div className="mt-4 flex items-center justify-start space-x-4"> 

//           <div className="flex-shrink-0  cursor-pointer"> 

//             <img src={Train} alt="Train" className="object-contain cursor-pointer" /> 

//           </div> 

 

//           <div className="flex-shrink-0  cursor-pointer"> 

//             <img src={Bus} alt="Bus" className="object-contain" /> 

//           </div> 

//         </div> 

//       )} 

//     </div> 

//   ); 

// }; 

 

// export default TravelOptions; 





