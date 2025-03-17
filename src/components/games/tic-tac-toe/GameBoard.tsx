
import React from "react";
import { BoardState, GameStatus } from "./types";

interface GameBoardProps {
  board: BoardState;
  gameStatus: GameStatus;
  onCellClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, gameStatus, onCellClick }) => {
  const renderCell = (index: number) => {
    return (
      <button
        className={`
          w-full h-full aspect-square flex items-center justify-center 
          text-3xl md:text-5xl font-semibold border border-border/80
          transition-all duration-300 ease-out ${board[index] ? "" : "hover:bg-secondary/50"}
          ${gameStatus === "paused" ? "opacity-50" : ""}
        `}
        onClick={() => onCellClick(index)}
        disabled={!!board[index] || gameStatus !== "playing"}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="mb-8 flex justify-center">
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs md:max-w-sm aspect-square">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div key={index} className="aspect-square">
            {renderCell(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
