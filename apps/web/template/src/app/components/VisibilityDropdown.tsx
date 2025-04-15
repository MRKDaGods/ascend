import React, { useState } from "react";
import { FaEye } from "react-icons/fa6";

const options: string[] = [
  "1st-degree connections only",
  "Your network",
  "All LinkedIn members",
  "Anyone",
];

const VisibilityDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("Anyone"); // Default

  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        onClick={toggleDropdown}
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "20px",
          padding: "5px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "6px",
          fontSize: "14px",
          cursor: "pointer",
          color: "rgb(8, 8, 8)",
        }}
      >
        <FaEye />
        <span>{selectedOption}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            background: "black",
            border: "1px solid #110e0e",
            borderRadius: "8px",
            width: "220px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  backgroundColor: isSelected ? "#222" : "black",
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              >
                {isSelected && (
                  <span style={{ color: "green", marginRight: "10px" }}>●</span>
                )}
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisibilityDropdown;
