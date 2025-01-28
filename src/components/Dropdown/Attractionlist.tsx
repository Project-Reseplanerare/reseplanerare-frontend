import { useState } from "react"; 

import aktivitetIcon from "../../assets/close.svg"; 

import kulturIcon from "../../assets/close.svg"; 

import matIcon from "../../assets/close.svg";

import boendeIcon from "../../assets/close.svg";

import designIcon from "../../assets/close.svg";

import evenemangIcon from "../../assets/close.svg"; 

 

function AttractionList() { 

    const [isOpen, setIsOpen] = useState(false); 

    const [activeIndex, setActiveIndex] = useState<number | null>(null);  

 

  

    const items = [ 

        { id: 1, label: "Aktiviteter", icon: aktivitetIcon }, 

        { id: 2, label: "Kultur & historia", icon: kulturIcon }, 

        { id: 3, label: "Mat & dryck", icon: matIcon }, 

        { id: 4, label: "Boende", icon: boendeIcon }, 

        { id: 5, label: "Design & shopping", icon: designIcon }, 

        { id: 6, label: "Evenemang", icon: evenemangIcon }, 

    ]; 

 

 

    const handleItemClick = (id: number) => { 

        setActiveIndex(id); 

    }; 

 

    return ( 

        <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 max-w-screen-lg w-full mx-auto shadow-md"> 

 

            <div 

                className="flex items-center justify-between w-full cursor-pointer" 

                onClick={() => setIsOpen(!isOpen)} 

            > 

                <h2 

                    className="text-xl font-bold" 

                    style={{ fontFamily: "Noto Serif, serif" }} 

                > 

                    Se och göra i Värmland 

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

                <div className="mt-4 flex flex-col space-y-4"> 

                    {items.map((item) => ( 

                        <div 

                            key={item.id} 

                            className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md ${activeIndex === item.id 

                                    ? "bg-blue-100 text-blue-600" 

                                    : "text-gray-600" 

                                }`} 

                            onClick={() => handleItemClick(item.id)}  

                        > 

                            <img src={item.icon} alt={`${item.label} icon`} className="w-6 h-6" /> 

                            <span className="text-sm">{item.label}</span> 

                        </div> 

                    ))} 

                </div> 

            )} 

        </div> 

    ); 

} 

 

export default AttractionList; 