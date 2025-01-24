import search from "../../assets/search.svg";
import close from "../../assets/close.svg";

function SearchInput() {
    return (
        <div className="w-full grid gap-4 bg-white border border-gray-300 p-4 mt-6 rounded-md text-center">
            {/* Intro Text */}
            <div className="grid gap-1">
                <p className="text-sm text-gray-700 font-normal">
                    Vet du vad du vill upptäcka, men inte var det finns?
                </p>
                <p className="text-sm text-gray-700 font-normal">
                    Sök här och hitta det snabbt!
                </p>
            </div>
            
            {/* Input Section */}
            <div className="flex items-center justify-center w-full max-w-md mx-auto border border-cyan-600 rounded-md">
                <div className="flex items-center justify-center px-3">
                    <img src={search} alt="Search" className="w-5 h-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="Ange plats eller stad"
                    className="flex-1 h-10 text-sm font-normal text-black placeholder-gray-500 px-3 focus:ring-1 focus:ring-cyan-700 focus:outline-none"
                />
                <button className="flex items-center justify-center px-3">
                    <img src={close} alt="Close" className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        </div>
    );
}

export default SearchInput;
