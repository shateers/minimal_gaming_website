
import React from "react";

type CellProps = {
  hasQueen: boolean;
  row: number;
  col: number;
  isSelected: boolean;
  isConflict: boolean;
  gameCompleted: boolean;
  onClick: (row: number, col: number) => void;
};

const Cell = ({
  hasQueen,
  row,
  col,
  isSelected,
  isConflict,
  gameCompleted,
  onClick,
}: CellProps) => {
  return (
    <button
      className={`
        w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl
        border-2 ${isSelected ? "border-[#C84B31]" : "border-gray-200"}
        ${(row + col) % 2 === 0 ? "bg-gray-100" : "bg-white"}
        ${isConflict ? "bg-red-200" : ""}
        ${hasQueen ? "text-[#C84B31]" : ""}
        ${gameCompleted ? "cursor-default" : "hover:bg-[#ECDBBA] cursor-pointer"}
        transition-colors
      `}
      onClick={() => !gameCompleted && onClick(row, col)}
      aria-label={`Cell at row ${row}, column ${col}${hasQueen ? ', has queen' : ''}`}
    >
      {hasQueen && "♛"}
    </button>
  );
};

export default Cell;
