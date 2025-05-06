
import { FC } from 'react';

type Player = 1 | 2;
type BoardCell = Player | null;
type GameStatus = 'playing' | 'paused' | 'won' | 'draw';

interface GameBoardProps {
  board: (BoardCell)[][];
  currentPlayer: Player;
  gameStatus: GameStatus;
  winningCells: [number, number][];
  onColumnClick: (column: number) => void;
}

const GameBoard: FC<GameBoardProps> = ({ 
  board, 
  currentPlayer, 
  gameStatus, 
  winningCells, 
  onColumnClick 
}) => {
  // Get classes for a cell
  const getCellClasses = (row: number, col: number, value: BoardCell) => {
    const isWinningCell = winningCells.some(([r, c]) => r === row && c === col);
    
    let classes = "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-200 ";
    
    if (value === null) {
      classes += "bg-white border-gray-300";
    } else if (value === 1) {
      classes += isWinningCell 
        ? "bg-red-500 border-red-700 animate-pulse shadow-lg" 
        : "bg-red-500 border-red-700";
    } else {
      classes += isWinningCell 
        ? "bg-yellow-400 border-yellow-600 animate-pulse shadow-lg" 
        : "bg-yellow-400 border-yellow-600";
    }
    
    return classes;
  };

  // Preview piece for hover effect
  const renderPreviewRow = () => {
    return (
      <div className="flex justify-center mb-2">
        {board[0].map((_, colIndex) => (
          <div 
            key={`preview-${colIndex}`} 
            className="w-10 h-10 md:w-12 md:h-12 mx-1 flex items-center justify-center cursor-pointer"
            onClick={() => gameStatus === 'playing' && onColumnClick(colIndex)}
            onMouseEnter={(e) => {
              if (gameStatus === 'playing') {
                const target = e.currentTarget;
                const isColumnFull = board[0][colIndex] !== null;
                if (!isColumnFull) {
                  target.innerHTML = `<div class="${currentPlayer === 1 ? 'bg-red-200' : 'bg-yellow-200'} w-8 h-8 md:w-10 md:h-10 rounded-full opacity-70"></div>`;
                }
              }
            }}
            onMouseLeave={(e) => {
              if (gameStatus === 'playing') {
                e.currentTarget.innerHTML = '';
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`game-board ${gameStatus === 'paused' ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
      {gameStatus === 'playing' && renderPreviewRow()}
      
      <div className="bg-blue-600 p-2 md:p-3 rounded-lg shadow-lg">
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center">
            {row.map((cell, colIndex) => (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="w-10 h-10 md:w-12 md:h-12 m-1 bg-blue-800 rounded-full flex items-center justify-center"
                onClick={() => gameStatus === 'playing' && onColumnClick(colIndex)}
              >
                <div className={getCellClasses(rowIndex, colIndex, cell)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
