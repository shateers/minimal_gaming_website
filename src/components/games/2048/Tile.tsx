
import React from "react";

interface TileProps {
  value: number;
}

const Tile = ({ value }: TileProps) => {
  // Get background color based on tile value
  const getBgColor = () => {
    switch (value) {
      case 2: return "bg-[#eee4da]";
      case 4: return "bg-[#ede0c8]";
      case 8: return "bg-[#f2b179]";
      case 16: return "bg-[#f59563]";
      case 32: return "bg-[#f67c5f]";
      case 64: return "bg-[#f65e3b]";
      case 128: return "bg-[#edcf72]";
      case 256: return "bg-[#edcc61]";
      case 512: return "bg-[#edc850]";
      case 1024: return "bg-[#edc53f]";
      case 2048: return "bg-[#edc22e]";
      default: return "bg-[#cdc1b4]";
    }
  };

  // Get text color based on tile value
  const getTextColor = () => {
    return value <= 4 ? "text-[#776e65]" : "text-white";
  };

  // Determine font size based on the number of digits
  const getFontSize = () => {
    if (value >= 1000) return "text-2xl md:text-3xl";
    return "text-3xl md:text-4xl";
  };

  return (
    <div 
      className={`
        ${getBgColor()} ${getTextColor()}
        w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
        font-bold rounded-md shadow-sm
        transition-all duration-200
      `}
    >
      {value > 0 && (
        <span className={`${getFontSize()}`}>
          {value}
        </span>
      )}
    </div>
  );
};

export default Tile;
