
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type CellValue = boolean;
type Board = CellValue[][];

const DIFFICULTIES = {
  easy: { size: 4 },
  medium: { size: 6 },
  hard: { size: 8 }
};

type Difficulty = keyof typeof DIFFICULTIES;

const Queens = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [conflicts, setConflicts] = useState<[number, number][]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [queensPlaced, setQueensPlaced] = useState(0);

  // Initialize board based on difficulty
  useEffect(() => {
    document.title = "Queens - GameHub";
    initializeBoard();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  const initializeBoard = () => {
    const size = DIFFICULTIES[difficulty].size;
    const newBoard: Board = Array(size).fill(null).map(() => Array(size).fill(false));
    
    setBoard(newBoard);
    setSelectedCell(null);
    setConflicts([]);
    setGameCompleted(false);
    setMoves(0);
    setQueensPlaced(0);
    
    // Reset and start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Check if a queen can be placed at the given position
  const canPlaceQueen = (row: number, col: number, boardState: Board = board): boolean => {
    const size = boardState.length;
    
    // Check row
    for (let j = 0; j < size; j++) {
      if (j !== col && boardState[row][j]) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < size; i++) {
      if (i !== row && boardState[i][col]) {
        return false;
      }
    }
    
    // Check diagonals
    // Up-left
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (boardState[i][j]) return false;
    }
    
    // Up-right
    for (let i = row - 1, j = col + 1; i >= 0 && j < size; i--, j++) {
      if (boardState[i][j]) return false;
    }
    
    // Down-left
    for (let i = row + 1, j = col - 1; i < size && j >= 0; i++, j--) {
      if (boardState[i][j]) return false;
    }
    
    // Down-right
    for (let i = row + 1, j = col + 1; i < size && j < size; i++, j++) {
      if (boardState[i][j]) return false;
    }
    
    return true;
  };

  // Find all conflicts on the board
  const findConflicts = () => {
    const size = board.length;
    const newConflicts: [number, number][] = [];
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j]) {
          const tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[i][j] = false;
          
          if (!canPlaceQueen(i, j, tempBoard)) {
            newConflicts.push([i, j]);
          }
        }
      }
    }
    
    setConflicts(newConflicts);
    return newConflicts.length === 0;
  };

  // Check if the current board state is valid
  const isValidBoard = () => {
    const size = board.length;
    let queensCount = 0;
    
    // Count queens
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j]) {
          queensCount++;
        }
      }
    }
    
    // The board is valid if there are exactly N queens and no conflicts
    const hasNoConflicts = findConflicts();
    return queensCount === size && hasNoConflicts;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameCompleted) return;
    
    const newBoard = [...board.map(row => [...row])];
    const current = newBoard[row][col];
    
    // If we're placing a queen, check if it's valid
    if (!current && !canPlaceQueen(row, col, newBoard)) {
      // Highlight conflicts and return
      findConflicts();
      return;
    }
    
    // Toggle queen
    newBoard[row][col] = !current;
    
    // Update queens count
    setQueensPlaced(prev => current ? prev - 1 : prev + 1);
    
    setBoard(newBoard);
    setSelectedCell([row, col]);
    setMoves(moves + 1);
    
    // Check for conflicts
    const noConflicts = findConflicts();
    
    // Check for game completion
    if (noConflicts && newBoard.flat().filter(Boolean).length === newBoard.length) {
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

  // Get a hint
  const getHint = () => {
    const size = board.length;
    
    // Try to place a queen in each empty cell
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!board[i][j] && canPlaceQueen(i, j)) {
          const newBoard = [...board.map(row => [...row])];
          newBoard[i][j] = true;
          setBoard(newBoard);
          setSelectedCell([i, j]);
          setMoves(moves + 1);
          setQueensPlaced(queensPlaced + 1);
          findConflicts();
          return;
        }
      }
    }
    
    // If no valid move found, suggest removing a problematic queen
    if (conflicts.length > 0) {
      const [row, col] = conflicts[0];
      const newBoard = [...board.map(row => [...row])];
      newBoard[row][col] = false;
      setBoard(newBoard);
      setSelectedCell([row, col]);
      setMoves(moves + 1);
      setQueensPlaced(queensPlaced - 1);
      findConflicts();
    }
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
            <h1 className="text-3xl font-bold">Queens</h1>
            <p className="text-muted-foreground mt-2">
              Place {DIFFICULTIES[difficulty].size} queens on the board so that no two queens can attack each other.
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
                  Queens: {queensPlaced}/{board.length}
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
              <p className="text-lg font-medium">Congratulations! You've solved the Queens puzzle!</p>
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
                  row.map((hasQueen, colIndex) => {
                    const isConflict = conflicts.some(([r, c]) => r === rowIndex && c === colIndex);
                    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                    
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl
                          border-2 ${isSelected ? 'border-primary' : 'border-gray-200'}
                          ${(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                          ${isConflict ? 'bg-red-200' : ''}
                          ${gameCompleted ? 'cursor-default' : 'hover:bg-gray-200 cursor-pointer'}
                          transition-colors
                        `}
                        onClick={() => !gameCompleted && handleCellClick(rowIndex, colIndex)}
                      >
                        {hasQueen && "♛"}
                      </button>
                    );
                  })
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
              onClick={getHint}
              disabled={gameCompleted}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hint
            </button>
          </div>
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Place {board.length} queens on the {board.length}x{board.length} board.</li>
              <li>Queens can move any number of squares horizontally, vertically, or diagonally.</li>
              <li>No two queens should be able to attack each other.</li>
              <li>Red highlighting indicates queens that are in conflict.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Queens;
