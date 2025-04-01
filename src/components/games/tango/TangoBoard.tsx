
import { useState } from 'react';

type CellValue = 0 | 1 | null;
type Board = CellValue[][];

interface TangoBoardProps {
  board: Board;
  gameCompleted: boolean;
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

const TangoBoard = ({ board, gameCompleted, selectedCell, onCellClick }: TangoBoardProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-border p-4">
        <div 
          className="grid gap-1" 
          style={{ 
            gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-lg font-bold
                  border-2 transition-colors
                  ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex 
                    ? 'border-primary' 
                    : 'border-gray-200'}
                  ${cell === null ? 'bg-white' : cell === 0 ? 'bg-blue-100' : 'bg-yellow-100'}
                  ${gameCompleted ? 'cursor-default' : 'hover:bg-gray-100 cursor-pointer'}
                `}
                onClick={() => !gameCompleted && onCellClick(rowIndex, colIndex)}
              >
                {cell !== null ? cell : ''}
              </button>
            ))
          ))}
        </div>
      </div>
    </div>
  );
};

export default TangoBoard;
