
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type CellValue = 0 | 1 | null;
type Board = CellValue[][];

const DIFFICULTIES = {
  easy: { size: 4 },
  medium: { size: 6 },
  hard: { size: 8 }
};

type Difficulty = keyof typeof DIFFICULTIES;

const Tango = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  // Initialize board based on difficulty
  useEffect(() => {
    document.title = "Tango - GameHub";
    initializeBoard();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  const initializeBoard = () => {
    const size = DIFFICULTIES[difficulty].size;
    const newBoard: Board = Array(size).fill(null).map(() => Array(size).fill(null));
    
    // Pre-fill some cells to make the puzzle solvable
    const filledCellCount = Math.floor(size * size * 0.3);
    let cellsFilled = 0;
    
    while (cellsFilled < filledCellCount) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (newBoard[row][col] === null) {
        // Randomly fill with 0 or 1
        newBoard[row][col] = Math.random() > 0.5 ? 1 : 0;
        cellsFilled++;
      }
    }
    
    setBoard(newBoard);
    setSelectedCell(null);
    setGameCompleted(false);
    setMoves(0);
    
    // Reset and start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Check if the current board state is valid according to Tango rules
  const isValidBoard = () => {
    const size = board.length;
    
    // Check for incomplete cells
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) return false;
      }
    }
    
    // Check rows
    for (let i = 0; i < size; i++) {
      // Count 0s and 1s in the row
      const rowCount = { 0: 0, 1: 0 };
      for (let j = 0; j < size; j++) {
        rowCount[board[i][j] as 0 | 1]++;
      }
      
      // Each row must have equal number of 0s and 1s
      if (rowCount[0] !== rowCount[1]) return false;
      
      // Check for more than two identical adjacent symbols
      for (let j = 0; j < size - 2; j++) {
        if (board[i][j] === board[i][j+1] && board[i][j] === board[i][j+2]) return false;
      }
    }
    
    // Check columns
    for (let j = 0; j < size; j++) {
      // Count 0s and 1s in the column
      const colCount = { 0: 0, 1: 0 };
      for (let i = 0; i < size; i++) {
        colCount[board[i][j] as 0 | 1]++;
      }
      
      // Each column must have equal number of 0s and 1s
      if (colCount[0] !== colCount[1]) return false;
      
      // Check for more than two identical adjacent symbols
      for (let i = 0; i < size - 2; i++) {
        if (board[i][j] === board[i+1][j] && board[i][j] === board[i+2][j]) return false;
      }
    }
    
    // All checks passed
    return true;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameCompleted) return;
    
    const newBoard = [...board];
    const currentValue = newBoard[row][col];
    
    // Cycle through values: null -> 0 -> 1 -> null
    if (currentValue === null) {
      newBoard[row][col] = 0;
    } else if (currentValue === 0) {
      newBoard[row][col] = 1;
    } else {
      newBoard[row][col] = null;
    }
    
    setBoard(newBoard);
    setSelectedCell([row, col]);
    setMoves(moves + 1);
    
    // Check for game completion
    if (isValidBoard()) {
      setGameCompleted(true);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    initializeBoard();
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl font-bold">Tango</h1>
            <p className="text-muted-foreground mt-2">
              Fill the grid with 0s and 1s. Each row and column must have an equal number of each digit, 
              and no more than two identical digits can be adjacent.
            </p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Moves: {moves}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="easy" onValueChange={(value) => handleDifficultyChange(value as Difficulty)}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {gameCompleted && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
              <p className="text-lg font-medium">Congratulations! You've completed the puzzle!</p>
              <p>Time: {formatTime(timer)} | Moves: {moves}</p>
            </div>
          )}
          
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
                      onClick={() => !gameCompleted && handleCellClick(rowIndex, colIndex)}
                    >
                      {cell !== null ? cell : ''}
                    </button>
                  ))
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              {gameCompleted ? 'New Game' : 'Reset Game'}
            </button>
            
            <button
              onClick={() => {
                const hint = getHint();
                if (hint) {
                  const [row, col, value] = hint;
                  const newBoard = [...board];
                  newBoard[row][col] = value;
                  setBoard(newBoard);
                  setSelectedCell([row, col]);
                  setMoves(moves + 1);
                }
              }}
              disabled={gameCompleted}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hint
            </button>
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fill the grid with 0s and 1s.</li>
              <li>Each row and column must contain an equal number of 0s and 1s.</li>
              <li>No more than two identical digits can be adjacent horizontally or vertically.</li>
              <li>Each row and column must be unique.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
  
  // Helper function to provide a hint
  function getHint(): [number, number, CellValue] | null {
    const size = board.length;
    
    // Try to find a cell where only one value is possible
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] !== null) continue;
        
        // Try both 0 and 1
        const tempBoard0 = JSON.parse(JSON.stringify(board));
        tempBoard0[i][j] = 0;
        const valid0 = checkPartialValidity(tempBoard0, i, j);
        
        const tempBoard1 = JSON.parse(JSON.stringify(board));
        tempBoard1[i][j] = 1;
        const valid1 = checkPartialValidity(tempBoard1, i, j);
        
        if (valid0 && !valid1) return [i, j, 0];
        if (!valid0 && valid1) return [i, j, 1];
      }
    }
    
    // If no obvious hint, find a random empty cell
    const emptyCells = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) emptyCells.push([i, j]);
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      return [row, col, Math.random() > 0.5 ? 1 : 0];
    }
    
    return null;
  }
  
  // Helper function to check if a board is partially valid
  function checkPartialValidity(board: Board, row: number, col: number): boolean {
    const size = board.length;
    
    // Check for three consecutive identical values in the row
    for (let j = Math.max(0, col - 2); j <= Math.min(size - 3, col); j++) {
      if (board[row][j] !== null && 
          board[row][j] === board[row][j+1] && 
          board[row][j] === board[row][j+2]) {
        return false;
      }
    }
    
    // Check for three consecutive identical values in the column
    for (let i = Math.max(0, row - 2); i <= Math.min(size - 3, row); i++) {
      if (board[i][col] !== null && 
          board[i][col] === board[i+1][col] && 
          board[i][col] === board[i+2][col]) {
        return false;
      }
    }
    
    // Check if the row has too many of one value
    const rowCount = { 0: 0, 1: 0 };
    for (let j = 0; j < size; j++) {
      if (board[row][j] === 0) rowCount[0]++;
      if (board[row][j] === 1) rowCount[1]++;
    }
    if (rowCount[0] > size/2 || rowCount[1] > size/2) return false;
    
    // Check if the column has too many of one value
    const colCount = { 0: 0, 1: 0 };
    for (let i = 0; i < size; i++) {
      if (board[i][col] === 0) colCount[0]++;
      if (board[i][col] === 1) colCount[1]++;
    }
    if (colCount[0] > size/2 || colCount[1] > size/2) return false;
    
    return true;
  }
};

export default Tango;
