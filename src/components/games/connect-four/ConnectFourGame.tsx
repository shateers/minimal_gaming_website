
import { useEffect, useRef, useState } from "react";
import { useConnectFourGame, type Player } from "../../../hooks/games/connect-four/useConnectFourGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ConnectFourGame = () => {
  const { 
    board, 
    currentPlayer, 
    status, 
    winningCells, 
    makeMove, 
    resetGame,
    isValidMove 
  } = useConnectFourGame();
  
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [isBoardReady, setBoardReady] = useState(false);

  useEffect(() => {
    setBoardReady(true);
  }, []);

  const getPlayerColor = (player: Player) => {
    return player === 1 ? "bg-red-500" : "bg-yellow-500";
  };

  const handleColumnClick = (col: number) => {
    if (status === "playing") {
      makeMove(col);
    }
  };

  const handleColumnHover = (col: number | null) => {
    setHoveredColumn(col);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="flex flex-col items-center">
      <Link to="/" className="self-start mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to games
      </Link>
      
      <div className="mb-6 flex items-center justify-center">
        {status === "playing" ? (
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-2 ${getPlayerColor(currentPlayer)}`} />
            <span className="text-lg font-medium">Player {currentPlayer}'s turn</span>
          </div>
        ) : status === "won" ? (
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full mr-2 ${getPlayerColor(currentPlayer === 1 ? 2 : 1)}`} />
            <span className="text-lg font-medium">Player {currentPlayer === 1 ? 2 : 1} wins!</span>
          </div>
        ) : (
          <span className="text-lg font-medium">It's a draw!</span>
        )}
      </div>
      
      {/* Game board */}
      <div 
        ref={boardRef}
        className="bg-blue-600 p-2 md:p-4 rounded-lg shadow-lg"
      >
        {/* Top row for hovering/selection */}
        {isBoardReady && (
          <div className="flex mb-2">
            {board[0].map((_, colIndex) => (
              <div 
                key={`selector-${colIndex}`} 
                className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center relative cursor-pointer"
                onClick={() => handleColumnClick(colIndex)}
                onMouseEnter={() => handleColumnHover(colIndex)}
                onMouseLeave={() => handleColumnHover(null)}
              >
                {hoveredColumn === colIndex && status === "playing" && isValidMove(colIndex) && (
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full absolute bottom-0 opacity-50 ${getPlayerColor(currentPlayer)}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Game cells */}
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
            {row.map((cell, colIndex) => (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="w-10 h-10 md:w-12 md:h-12 bg-blue-700 m-1 rounded-full flex justify-center items-center"
                onClick={() => handleColumnClick(colIndex)}
              >
                {cell !== null && (
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${getPlayerColor(cell)} ${
                      isWinningCell(rowIndex, colIndex) ? "animate-pulse" : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {(status === "won" || status === "draw") && (
        <Button 
          className="mt-6"
          onClick={resetGame}
        >
          Play Again
        </Button>
      )}
    </div>
  );
};

export default ConnectFourGame;
