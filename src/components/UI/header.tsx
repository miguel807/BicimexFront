import React from "react";
import SortDropdown from "../SortDropdown";
import { useNavigate } from "react-router-dom";
import Logo from "../../svg/logo";

interface HeaderProps {
  size: number;
  onSortChange: (option: string) => void;
  currentSort: string;
}

const Header: React.FC<HeaderProps> = ({ size, onSortChange, currentSort }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <header className="h-20 p-4 flex justify-between items-center bg-[#373F68] rounded-md">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300">
              <Logo />
            </span>
            <h1 className="font-medium text-white text-xl">
              {size} Suggestions
            </h1>
          </div>

          <div className="hidden sm:flex items-center text-sm text-gray-300">
            <div className="p-4">
              <SortDropdown
                onOptionSelect={onSortChange}
                selectedOption={currentSort}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/create-feedback")}
          className="bg-[#AD1FEA] hover:bg-[#C75AF6] text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          + Add Feedback
        </button>
      </header>
    </div>
  );
};

export default Header;
