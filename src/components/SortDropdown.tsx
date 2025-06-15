import { useState } from "react";


interface SortDropdownProps {
  onOptionSelect: (option: string) => void;
  selectedOption: string;
}
const SortDropdown: React.FC<SortDropdownProps> = ({ onOptionSelect, selectedOption }) => {

  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    "Most Upvotes",
    "Least Upvotes",
    "Most Comments",
    "Least Comments"
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

    return (
      <div className="relative inline-block text-left ">
        <div>
          <button
            type="button"
            className="bg-[#373F68] inline-flex justify-center items-center hover:bg-opacity-80 transition-colors"
            onClick={toggleDropdown}
          >
            <span className="text-[#F2F4FE] font-thin mr-2">Sort by :</span>
            <span className="text-[#F2F4FE] font-bold">{selectedOption}</span>
            <svg
              className={`ml-2 h-4 w-4 text-[#F2F4FE] transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
  
        {isOpen && (
  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
    <div
      className="py-1"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      {options.map((option) => (
        <button
          key={option}
          className={`flex bg-white justify-between items-center w-full text-left px-4 py-2 text-sm ${
            selectedOption === option
              ? "text-[#AD1FEA] font-medium"
              : "text-[#647196]"
          }`}
          onClick={() => handleOptionClick(option)}
        >
          <span>{option}</span>
          {selectedOption === option && (
            <svg 
              className="w-4 h-4 text-[#AD1FEA]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </button>
      ))}
    </div>
  </div>
)}
      </div>
    );
  };
  
  export default SortDropdown;