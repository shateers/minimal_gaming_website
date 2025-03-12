
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

type SudokuBoard = (number | null)[][];
type DifficultyLevel = "easy" | "medium" | "hard";

const Sudoku = () => {
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "over">("playing");
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Generate a new Sudoku board
  const generateBoard = useCallback((difficulty: DifficultyLevel) => {
    // For simplicity, we'll use a pre-defined board
    // In a real implementation, you would generate a valid Sudoku board
    
    // Create an empty 9x9 board
    const emptyBoard: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Add some initial numbers based on difficulty
    // This is a simplified example - a real sudoku would need proper generation
    const easyPattern = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];
    
    const mediumPattern = [
      [null, null, null, 2, 6, null, 7, null, 1],
      [6, 8, null, null, 7, null, null, 9, null],
      [1, 9, null, null, null, 4, 5, null, null],
      [8, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, 6, null, 2, 9, null, null],
      [null, 5, null, null, null, 3, null, 2, 8],
      [null, null, 9, 3, null, null, null, 7, 4],
      [null, 4, null, null, 5, null, null, 3, 6],
      [7, null, 3, null, 1, 8, null, null, null],
    ];
    
    const hardPattern = [
      [null, null, null, null, null, 6, null, null, null],
      [null, 5, 9, null, null, null, null, null, 8],
      [2, null, null, null, null, 8, null, null, null],
      [null, 4, 5, null, null, null, null, null, null],
      [null, null, 3, null, null, null, 1, null, null],
      [null, null, 6, null, null, 3, null, 5, 4],
      [null, null, null, 3, 2, 5, null, null, 6],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ];
    
    let selectedPattern;
    switch (difficulty) {
      case "easy":
        selectedPattern = easyPattern;
        break;
      case "medium":
        selectedPattern = mediumPattern;
        break;
      case "hard":
        selectedPattern = hardPattern;
        break;
      default:
        selectedPattern = easyPattern;
    }
    
    // Deep copy the selected pattern
    const newBoard = selectedPattern.map(row => [...row]);
    const initialBoardCopy = selectedPattern.map(row => [...row]);
    
    setBoard(newBoard);
    setInitialBoard(initialBoardCopy);
    
    return newBoard;
  }, []);

  useEffect(() => {
    document.title = "Sudoku - GameHub";
    
    // Initialize the game
    generateBoard(difficulty);
    
    // Start timer
    if (gameStatus === "playing") {
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [difficulty, gameStatus, generateBoard]);

  useEffect(() => {
    // Check if the board is complete and valid
    if (board.length > 0) {
      const isBoardFilled = board.every(row => row.every(cell => cell !== null));
      if (isBoardFilled && isSudokuValid(board)) {
        setIsComplete(true);
        setGameStatus("over");
        if (timerInterval) {
          clearInterval(timerInterval);
        }
      }
    }
  }, [board, timerInterval]);

  const handleCellSelect = (rowIndex: number, colIndex: number) => {
    if (gameStatus === "playing" && (initialBoard[rowIndex][colIndex] === null)) {
      setSelectedCell([rowIndex, colIndex]);
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell && gameStatus === "playing") {
      const [rowIndex, colIndex] = selectedCell;
      
      // Only allow input if this was not an initial cell
      if (initialBoard[rowIndex][colIndex] === null) {
        const newBoard = [...board];
        newBoard[rowIndex][colIndex] = number;
        setBoard(newBoard);
      }
    }
  };

  const handleClear = () => {
    if (selectedCell && gameStatus === "playing") {
      const [rowIndex, colIndex] = selectedCell;
      
      // Only allow clearing if this was not an initial cell
      if (initialBoard[rowIndex][colIndex] === null) {
        const newBoard = [...board];
        newBoard[rowIndex][colIndex] = null;
        setBoard(newBoard);
      }
    }
  };

  const handleReset = () => {
    generateBoard(difficulty);
    setSelectedCell(null);
    setGameStatus("playing");
    setIsComplete(false);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handlePauseResume = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    handleReset();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Validate if the Sudoku board is correct
  const isSudokuValid = (board: SudokuBoard): boolean => {
    // Check rows
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set<number>();
      for (let j = 0; j < 9; j++) {
        const cell = board[i][j];
        if (cell !== null) {
          if (rowSet.has(cell)) return false;
          rowSet.add(cell);
        }
      }
    }
  
    // Check columns
    for (let j = 0; j < 9; j++) {
      const colSet = new Set<number>();
      for (let i = 0; i < 9; i++) {
        const cell = board[i][j];
        if (cell !== null) {
          if (colSet.has(cell)) return false;
          colSet.add(cell);
        }
      }
    }
  
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxSet = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const rowIndex = boxRow * 3 + i;
            const colIndex = boxCol * 3 + j;
            const cell = board[rowIndex][colIndex];
            if (cell !== null) {
              if (boxSet.has(cell)) return false;
              boxSet.add(cell);
            }
          }
        }
      }
    }
  
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="game-container animate-fade-in max-w-2xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Sudoku</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-center items-center gap-4">
            <div className="text-sm font-medium">Difficulty:</div>
            <div className="flex gap-2">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  className={`px-3 py-1 rounded-full text-sm ${
                    difficulty === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => handleDifficultyChange(level as DifficultyLevel)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            {board.length > 0 && (
              <div 
                className={`grid grid-cols-9 gap-[1px] bg-muted rounded-md overflow-hidden
                  ${gameStatus === "paused" ? "opacity-50" : ""}`}
              >
                {board.map((row, rowIndex) => (
                  row.map((cell, colIndex) => {
                    const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                    const isInitial = initialBoard[rowIndex][colIndex] !== null;
                    const boxRowStart = Math.floor(rowIndex / 3) * 3;
                    const boxColStart = Math.floor(colIndex / 3) * 3;
                    const isSameBox = selectedCell ? 
                      Math.floor(selectedCell[0] / 3) === Math.floor(rowIndex / 3) && 
                      Math.floor(selectedCell[1] / 3) === Math.floor(colIndex / 3) 
                      : false;
                    
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
                          text-sm md:text-base font-medium bg-white
                          ${isSelected ? "bg-blue-100" : ""}
                          ${isSameBox ? "bg-blue-50" : ""}
                          ${isInitial ? "font-bold" : ""}
                          ${(rowIndex === 2 || rowIndex === 5) && rowIndex !== 8 ? "border-b-2 border-gray-400" : ""}
                          ${(colIndex === 2 || colIndex === 5) && colIndex !== 8 ? "border-r-2 border-gray-400" : ""}
                          hover:bg-secondary/50 transition-colors
                        `}
                        onClick={() => handleCellSelect(rowIndex, colIndex)}
                        disabled={gameStatus !== "playing"}
                      >
                        {cell}
                      </button>
                    );
                  })
                ))}
              </div>
            )}
          </div>

          <div className="mb-8 flex justify-center">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  className={`
                    w-10 h-10 flex items-center justify-center
                    text-base font-medium rounded-md bg-secondary
                    hover:bg-secondary/80 transition-colors
                  `}
                  onClick={() => handleNumberInput(number)}
                  disabled={gameStatus !== "playing" || !selectedCell}
                >
                  {number}
                </button>
              ))}
              <button
                className={`
                  w-10 h-10 flex items-center justify-center
                  text-base font-medium rounded-md bg-secondary
                  hover:bg-secondary/80 transition-colors
                `}
                onClick={handleClear}
                disabled={gameStatus !== "playing" || !selectedCell}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center mb-2">
              {isComplete ? (
                <div className="text-lg font-medium text-green-600">Puzzle solved! Congratulations!</div>
              ) : (
                <div className="text-lg font-medium">
                  {gameStatus === "paused" ? "Game paused" : "Select a cell and input numbers"}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleReset} 
                className="game-control-button"
              >
                Restart
              </button>

              {gameStatus !== "over" && (
                <button 
                  onClick={handlePauseResume} 
                  className="game-control-button"
                >
                  {gameStatus === "playing" ? "Pause" : "Resume"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sudoku;
