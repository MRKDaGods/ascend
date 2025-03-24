import React, { useState } from "react";
import { FaEye } from "react-icons/fa6"; // Use fa6 instead of fa

import "./VisibilityDropdown.css"; // Import CSS file

const options: string[] = [
  "1st-degree connections only",
  "Your network",
  "All LinkedIn members",
  "Anyone",
];

const VisibilityDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("Anyone"); // Default selection

  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="visibility-container">
      <button className="eye-button" onClick={toggleDropdown}>
        <FaEye />
        <span>{selectedOption}</span>
      </button>

      {isOpen &&( 
        <div className="dropdown-menu">
          {options.map((option, index) => (
            <div
              key={index}
              className={`dropdown-item ${selectedOption === option ? "selected" : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisibilityDropdown;