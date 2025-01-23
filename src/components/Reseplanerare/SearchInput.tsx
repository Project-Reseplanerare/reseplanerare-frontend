import search from "../../assets/search.svg";
import close from "../../assets/close.svg";

function SearchInput() {
    return (
        <div className="w-full bg-white border dorder-gray-300 p-4 mt-[25px] mb-5 rounded-md text-center">
            <div className="mb-4">
                <p className="text-[15px] text-gray-700 font-normal leading-snug">
                Vet du vad du vill upptäcka, men inte var det finns? 
                </p>
                <p className="text-[15px] text-gray-700 font-normal leading-snug">
                Sök här och hitta det snabbt!
                </p>
            </div>
            <div className="relative w-full max-w-[388px] mx-auto">

                <span className="absolute inset-y-0 left-4 flex items-center">
                    <img src={search} alt="Search" className="w-5 h-5 text-gray-500" />
                </span>

                <input
                    type="text"
                    placeholder="Sök" // här kanske skriva 'Ange plats eller stad'???
                    className="w-full pl-[40px] pr-[40px] h-[29px] text-[15px] font-normal placeholder:text-black border border-cyan-600 rounded-md focus:ring-1 focus:ring-cyan-700 focus:outline-none"
                />

                <span className="absolute inset-y-0 right-4 flex items-center cursor-pointer">
                    <img src={close} alt="Close" className="w-3 h-3 text-gray-500" />
                </span>
            </div>

        </div>
    )
}

export default SearchInput;