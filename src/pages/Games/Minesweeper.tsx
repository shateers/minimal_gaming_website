
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeIn from "../../components/animations/FadeIn";

type CellValue = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_SETTINGS = {
  easy: { width: 9, height: 9, mines: 10 },
  medium: { width: 16, height: 16, mines: 40 },
  hard: { width: 30, height: 16, mines: 99 },
};

const Minesweeper = () => {
  const [board, setBoard] = useState<CellValue[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [minesRemaining, setMinesRemaining] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize the game
  useEffect(() => {
    document.title = "Minesweeper - Shateer Games";
    resetGame();
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  // Initialize the board
  const createEmptyBoard = () => {
    const { width, height } = DIFFICULTY_SETTINGS[difficulty];
    const newBoard: CellValue[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: CellValue[] = [];
      for (let x = 0; x < width; x++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      newBoard.push(row);
    }
    
    return newBoard;
  };

  // Place mines randomly, avoiding the first clicked cell
  const placeMines = (board: CellValue[][], firstClickY: number, firstClickX: number) => {
    const { width, height, mines } = DIFFICULTY_SETTINGS[difficulty];
    let minesPlaced = 0;
    
    const newBoard = JSON.parse(JSON.stringify(board));
    
    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      // Don't place a mine on the first clicked cell or where a mine already exists
      if ((y === firstClickY && x === firstClickX) || newBoard[y][x].isMine) {
        continue;
      }
      
      newBoard[y][x].isMine = true;
      minesPlaced++;
    }
    
    // Calculate adjacent mines for each cell
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (newBoard[y][x].isMine) continue;
        
        let count = 0;
        // Check all 8 adjacent cells
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width && newBoard[ny][nx].isMine) {
              count++;
            }
          }
        }
        
        newBoard[y][x].adjacentMines = count;
      }
    }
    
    return newBoard;
  };

  // Reset the game
  const resetGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
    
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setGameStatus("playing");
    setTimer(0);
    setFirstClick(true);
    setMinesRemaining(DIFFICULTY_SETTINGS[difficulty].mines);
  };

  // Start the timer
  const startTimer = () => {
    if (timerInterval) return;
    
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Handle cell click
  const handleCellClick = (y: number, x: number) => {
    if (gameStatus !== "playing" || board[y][x].isRevealed || board[y][x].isFlagged) {
      return;
    }
    
    // On first click, ensure no mine is clicked and start the timer
    if (firstClick) {
      setFirstClick(false);
      startTimer();
      const newBoard = placeMines(board, y, x);
      setBoard(newBoard);
      // Reveal the clicked cell after mines are placed
      setTimeout(() => revealCell(y, x, newBoard), 50);
      return;
    }
    
    // If mine is clicked, game over
    if (board[y][x].isMine) {
      gameOver();
      return;
    }
    
    revealCell(y, x, board);
  };

  // Handle right-click (flag placement)
  const handleRightClick = (e: React.MouseEvent, y: number, x: number) => {
    e.preventDefault();
    
    if (gameStatus !== "playing" || board[y][x].isRevealed) {
      return;
    }
    
    const newBoard = [...board];
    newBoard[y][x] = {
      ...newBoard[y][x],
      isFlagged: !newBoard[y][x].isFlagged,
    };
    
    setBoard(newBoard);
    
    // Update mines remaining count
    setMinesRemaining(prevCount => 
      newBoard[y][x].isFlagged ? prevCount - 1 : prevCount + 1
    );
  };

  // Reveal cell and its neighbors if it has no adjacent mines
  const revealCell = (y: number, x: number, currentBoard: CellValue[][]) => {
    const { width, height } = DIFFICULTY_SETTINGS[difficulty];
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    
    // If already revealed or flagged, do nothing
    if (newBoard[y][x].isRevealed || newBoard[y][x].isFlagged) {
      return newBoard;
    }
    
    // Reveal the cell
    newBoard[y][x].isRevealed = true;
    
    // If no adjacent mines, reveal neighbors recursively
    if (newBoard[y][x].adjacentMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          
          const ny = y + dy;
          const nx = x + dx;
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            // Recursively reveal neighbors
            newBoard = revealCell(ny, nx, newBoard);
          }
        }
      }
    }
    
    // Check for win condition
    checkWinCondition(newBoard);
    
    setBoard(newBoard);
    return newBoard;
  };

  // Check if player has won
  const checkWinCondition = (currentBoard: CellValue[][]) => {
    const { width, height, mines } = DIFFICULTY_SETTINGS[difficulty];
    let revealedCount = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (currentBoard[y][x].isRevealed) {
          revealedCount++;
        }
      }
    }
    
    // Player wins if all non-mine cells are revealed
    if (revealedCount === width * height - mines) {
      setGameStatus("won");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Game over - reveal all mines
  const gameOver = () => {
    const newBoard = [...board];
    
    for (let y = 0; y < newBoard.length; y++) {
      for (let x = 0; x < newBoard[y].length; x++) {
        if (newBoard[y][x].isMine) {
          newBoard[y][x].isRevealed = true;
        }
      }
    }
    
    setBoard(newBoard);
    setGameStatus("lost");
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Handle revealing cells around a number when clicking a revealed cell
  const handleRevealAdjacent = (y: number, x: number) => {
    if (!board[y][x].isRevealed || board[y][x].adjacentMines === 0 || gameStatus !== "playing") {
      return;
    }
    
    const { width, height } = DIFFICULTY_SETTINGS[difficulty];
    let flaggedCount = 0;
    
    // Count flagged adjacent cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        
        const ny = y + dy;
        const nx = x + dx;
        
        if (ny >= 0 && ny < height && nx >= 0 && nx < width && board[ny][nx].isFlagged) {
          flaggedCount++;
        }
      }
    }
    
    // If the number of flags matches the cell's number, reveal all non-flagged adjacent cells
    if (flaggedCount === board[y][x].adjacentMines) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          
          const ny = y + dy;
          const nx = x + dx;
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width && 
              !board[ny][nx].isRevealed && !board[ny][nx].isFlagged) {
            if (board[ny][nx].isMine) {
              gameOver();
              return;
            }
            revealCell(ny, nx, board);
          }
        }
      }
    }
  };

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get cell color based on adjacent mines
  const getCellColor = (cell: CellValue) => {
    if (!cell.isRevealed) return "bg-gray-300 hover:bg-gray-200";
    if (cell.isMine) return "bg-red-500";
    
    const colors = [
      "bg-gray-100", // 0
      "text-blue-600", // 1
      "text-green-600", // 2
      "text-red-600", // 3
      "text-purple-600", // 4
      "text-yellow-600", // 5
      "text-pink-600", // 6
      "text-orange-600", // 7
      "text-violet-600", // 8
    ];
    
    return colors[cell.adjacentMines];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Minesweeper</h1>
              <p className="text-muted-foreground mt-2">
                Clear the minefield without detonating any mines. Right-click to flag suspected mines.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                  <div className="text-lg font-medium">
                    Time: {formatTime(timer)}
                  </div>
                </div>
                
                <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                  <div className="text-lg font-medium">
                    Mines: {minesRemaining}
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="easy" onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <TabsList>
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            {gameStatus === "won" && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                <p className="text-lg font-medium">Congratulations! You've won!</p>
                <p>Time: {formatTime(timer)}</p>
              </div>
            )}
            
            {gameStatus === "lost" && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
                <p className="text-lg font-medium">Game Over! You hit a mine!</p>
                <p>Time: {formatTime(timer)}</p>
              </div>
            )}
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="flex justify-center mb-8">
              <div 
                className="bg-white rounded-lg shadow-sm border border-border p-2"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div 
                  className={`grid gap-[1px] bg-gray-400`}
                  style={{
                    gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].width}, minmax(0, 1fr))`,
                  }}
                >
                  {board.map((row, y) => (
                    row.map((cell, x) => (
                      <button
                        key={`${y}-${x}`}
                        className={`
                          w-7 h-7 md:w-8 md:h-8 flex items-center justify-center 
                          text-xs md:text-sm font-medium
                          ${getCellColor(cell)}
                          transition-colors duration-150
                          ${gameStatus !== "playing" ? "cursor-default" : "cursor-pointer"}
                        `}
                        onClick={() => 
                          cell.isRevealed 
                            ? handleRevealAdjacent(y, x) 
                            : handleCellClick(y, x)
                        }
                        onContextMenu={(e) => handleRightClick(e, y, x)}
                        disabled={gameStatus !== "playing"}
                      >
                        {cell.isRevealed 
                          ? cell.isMine 
                            ? "💣" 
                            : cell.adjacentMines > 0 
                              ? cell.adjacentMines 
                              : ""
                          : cell.isFlagged 
                            ? "🚩" 
                            : ""}
                      </button>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                {gameStatus !== "playing" ? 'New Game' : 'Reset Game'}
              </button>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.5}>
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4">How to Play</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Left-click to reveal a cell.</li>
                <li>Right-click to place a flag where you think a mine is located.</li>
                <li>The numbers indicate how many mines are adjacent to that cell.</li>
                <li>Left-click on a revealed number to automatically reveal adjacent cells if you've flagged the correct number of mines.</li>
                <li>Clear all cells without mines to win!</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Minesweeper;
