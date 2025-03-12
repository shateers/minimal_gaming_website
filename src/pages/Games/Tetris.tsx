
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// Tetris piece shapes represented as coordinates
const TETROMINOS = {
  I: [
    [0, 0], [0, 1], [0, 2], [0, 3]
  ],
  J: [
    [0, 0], [1, 0], [1, 1], [1, 2]
  ],
  L: [
    [0, 2], [1, 0], [1, 1], [1, 2]
  ],
  O: [
    [0, 0], [0, 1], [1, 0], [1, 1]
  ],
  S: [
    [0, 1], [0, 2], [1, 0], [1, 1]
  ],
  T: [
    [0, 1], [1, 0], [1, 1], [1, 2]
  ],
  Z: [
    [0, 0], [0, 1], [1, 1], [1, 2]
  ]
};

// Colors for the different tetrominos
const COLORS = {
  I: "bg-cyan-400",
  J: "bg-blue-500",
  L: "bg-orange-500",
  O: "bg-yellow-400",
  S: "bg-green-500",
  T: "bg-purple-500",
  Z: "bg-red-500",
};

type TetrominoType = keyof typeof TETROMINOS;
type Position = { x: number; y: number };
type TetrisBoard = (TetrominoType | null)[][];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const GAME_SPEEDS = {
  slow: 800,
  medium: 500,
  fast: 200,
};

const Tetris = () => {
  const [board, setBoard] = useState<TetrisBoard>([]);
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetrominoType;
    position: Position;
    rotation: number;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "over">("playing");
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [speed, setSpeed] = useState<keyof typeof GAME_SPEEDS>("medium");
  const [timer, setTimer] = useState<number>(0);
  const [gameInterval, setGameInterval] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  const lastTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);

  // Initialize an empty board
  const createEmptyBoard = useCallback((): TetrisBoard => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  }, []);

  // Get a random tetromino type
  const getRandomTetromino = useCallback((): TetrominoType => {
    const types = Object.keys(TETROMINOS) as TetrominoType[];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  // Generate a new piece
  const generateNewPiece = useCallback(() => {
    // If we already have a next piece, use that, otherwise generate a random one
    const pieceType = nextPiece || getRandomTetromino();
    // Generate the next piece for preview
    const newNextPiece = getRandomTetromino();
    
    setCurrentPiece({
      type: pieceType,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0,
    });
    
    setNextPiece(newNextPiece);
  }, [nextPiece, getRandomTetromino]);

  // Initialize the game
  const initGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameStatus("playing");
    generateNewPiece();
  }, [createEmptyBoard, generateNewPiece]);

  // Get the actual coordinates of a piece considering its position and rotation
  const getPieceCoordinates = useCallback((piece: { type: TetrominoType; position: Position; rotation: number }) => {
    const { type, position, rotation } = piece;
    const tetromino = TETROMINOS[type];
    
    // Apply rotation (0, 90, 180, 270 degrees)
    const rotatedPiece = tetromino.map(([y, x]) => {
      // 0 degrees: return as is
      if (rotation === 0) return [y, x];
      // 90 degrees
      if (rotation === 1) return [x, -y];
      // 180 degrees
      if (rotation === 2) return [-y, -x];
      // 270 degrees
      return [-x, y]; // rotation === 3
    });
    
    // Apply position offset
    return rotatedPiece.map(([y, x]) => ({
      y: y + position.y,
      x: x + position.x,
    }));
  }, []);

  // Check if a piece can be placed at a given position
  const isValidMove = useCallback((piece: { type: TetrominoType; position: Position; rotation: number }) => {
    const coords = getPieceCoordinates(piece);
    
    // Check if all coordinates are within bounds and not overlapping existing pieces
    return coords.every(({ y, x }) => {
      const isWithinBounds = y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH;
      const isNotOverlapping = isWithinBounds && board[y]?.[x] === null;
      return isWithinBounds && isNotOverlapping;
    });
  }, [board, getPieceCoordinates]);

  // Move the current piece down, left, or right
  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameStatus !== "playing") return;
    
    const newPosition = {
      x: currentPiece.position.x + dx,
      y: currentPiece.position.y + dy,
    };
    
    const newPiece = {
      ...currentPiece,
      position: newPosition,
    };
    
    if (isValidMove(newPiece)) {
      setCurrentPiece(newPiece);
      return true;
    }
    
    // If we tried to move down and it failed, the piece has landed
    if (dy > 0) {
      placePiece();
      return false;
    }
    
    return false;
  }, [currentPiece, gameStatus, isValidMove]);

  // Rotate the current piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameStatus !== "playing") return;
    
    const newRotation = (currentPiece.rotation + 1) % 4;
    
    const newPiece = {
      ...currentPiece,
      rotation: newRotation,
    };
    
    // If rotation is valid, update the piece
    if (isValidMove(newPiece)) {
      setCurrentPiece(newPiece);
    } else {
      // Try wall kicks - move the piece left or right to make space for rotation
      const wallKickOffsets = [-1, 1, -2, 2];
      for (const offset of wallKickOffsets) {
        const kickedPiece = {
          ...newPiece,
          position: {
            ...newPiece.position,
            x: newPiece.position.x + offset,
          },
        };
        
        if (isValidMove(kickedPiece)) {
          setCurrentPiece(kickedPiece);
          break;
        }
      }
    }
  }, [currentPiece, gameStatus, isValidMove]);

  // Place the current piece on the board
  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const coords = getPieceCoordinates(currentPiece);
    
    // Create a new board with the placed piece
    const newBoard = board.map(row => [...row]);
    coords.forEach(({ y, x }) => {
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = currentPiece.type;
      }
    });
    
    setBoard(newBoard);
    
    // If any of the placed blocks are at the top row, game over
    if (coords.some(({ y }) => y === 0)) {
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (gameInterval) {
        clearInterval(gameInterval);
      }
      return;
    }
    
    // Generate a new piece
    generateNewPiece();
    
    // Check for completed rows and update score
    checkRows(newBoard);
  }, [board, currentPiece, generateNewPiece, getPieceCoordinates, gameInterval, timerInterval]);

  // Check for completed rows and update the board
  const checkRows = useCallback((board: TetrisBoard) => {
    let newBoard = [...board];
    let completedRows = 0;
    
    // Check each row from bottom to top
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      // If row is completely filled (no nulls)
      if (newBoard[y].every(cell => cell !== null)) {
        completedRows++;
        
        // Remove the completed row
        newBoard = [
          Array(BOARD_WIDTH).fill(null), // Add empty row at top
          ...newBoard.slice(0, y), // Keep rows above
          ...newBoard.slice(y + 1) // Keep rows below, skipping the completed row
        ];
      }
    }
    
    if (completedRows > 0) {
      // Update board
      setBoard(newBoard);
      
      // Calculate score based on number of lines cleared and current level
      const newScore = score + calculateScore(completedRows, level);
      setScore(newScore);
      
      // Update lines cleared
      const newLinesCleared = linesCleared + completedRows;
      setLinesCleared(newLinesCleared);
      
      // Update level every 10 lines
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }
    }
  }, [score, level, linesCleared]);

  // Calculate score based on number of lines cleared and current level
  const calculateScore = (lines: number, level: number) => {
    const basePoints = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
    return basePoints[lines] * level;
  };

  // Hard drop the piece to the lowest possible position
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameStatus !== "playing") return;
    
    let dropDistance = 0;
    let canMoveDown = true;
    
    while (canMoveDown) {
      const newPosition = {
        x: currentPiece.position.x,
        y: currentPiece.position.y + dropDistance + 1,
      };
      
      const newPiece = {
        ...currentPiece,
        position: newPosition,
      };
      
      if (isValidMove(newPiece)) {
        dropDistance++;
      } else {
        canMoveDown = false;
      }
    }
    
    // Move the piece down by the calculated distance
    if (dropDistance > 0) {
      setCurrentPiece({
        ...currentPiece,
        position: {
          x: currentPiece.position.x,
          y: currentPiece.position.y + dropDistance,
        },
      });
      
      // Add some bonus points for hard drop
      setScore(prevScore => prevScore + dropDistance);
      
      // Place the piece immediately after hard drop
      setTimeout(placePiece, 0);
    }
  }, [currentPiece, gameStatus, isValidMove, placePiece]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    
    if (gameStatus === "playing" && deltaTime > GAME_SPEEDS[speed]) {
      lastTimeRef.current = timestamp;
      movePiece(0, 1); // Move down
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStatus, movePiece, speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "playing") return;
      
      switch (e.code) {
        case "ArrowLeft":
          movePiece(-1, 0); // Move left
          break;
        case "ArrowRight":
          movePiece(1, 0); // Move right
          break;
        case "ArrowDown":
          movePiece(0, 1); // Move down
          break;
        case "ArrowUp":
          rotatePiece(); // Rotate
          break;
        case "Space":
          hardDrop(); // Hard drop
          break;
        default:
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStatus, movePiece, rotatePiece, hardDrop]);

  // Initialize game on mount
  useEffect(() => {
    document.title = "Tetris - GameHub";
    initGame();
    
    // Start timer
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [initGame, gameLoop]);

  // Update game loop when game status changes
  useEffect(() => {
    if (gameStatus === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStatus, gameLoop]);

  // Handle pause/resume
  const handlePauseResume = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      lastTimeRef.current = 0; // Reset last time to avoid sudden drops
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Reset the game
  const handleReset = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    initGame();
    setTimer(0);
    
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    lastTimeRef.current = 0;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Change game speed
  const handleSpeedChange = (newSpeed: keyof typeof GAME_SPEEDS) => {
    setSpeed(newSpeed);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Render the game board
  const renderBoard = () => {
    // Create a copy of the board to render the current piece
    const displayBoard = board.map(row => [...row]);
    
    // Add the current falling piece to the display board
    if (currentPiece && gameStatus === "playing") {
      const pieceCoords = getPieceCoordinates(currentPiece);
      pieceCoords.forEach(({ y, x }) => {
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          displayBoard[y][x] = currentPiece.type;
        }
      });
    }
    
    return (
      <div 
        className={`grid grid-cols-10 gap-[1px] bg-gray-800 p-1 rounded-md
                   ${gameStatus === "paused" ? "opacity-50" : ""}`}
      >
        {displayBoard.map((row, y) => (
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 md:w-7 md:h-7 ${
                cell ? COLORS[cell] : "bg-gray-900"
              }`}
            />
          ))
        ))}
      </div>
    );
  };

  // Render the next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    // Create a 4x4 grid for the next piece preview
    const previewGrid = Array(4).fill(null).map(() => Array(4).fill(null));
    
    // Get the base tetromino shape
    const tetromino = TETROMINOS[nextPiece];
    
    // Center the piece in the preview
    const centerOffset = { x: 1, y: 1 };
    
    // Place the piece in the preview grid
    tetromino.forEach(([y, x]) => {
      const newY = y + centerOffset.y;
      const newX = x + centerOffset.x;
      
      if (newY >= 0 && newY < 4 && newX >= 0 && newX < 4) {
        previewGrid[newY][newX] = nextPiece;
      }
    });
    
    return (
      <div className="grid grid-cols-4 gap-[1px] bg-gray-800 p-1 rounded-md">
        {previewGrid.map((row, y) => (
          row.map((cell, x) => (
            <div
              key={`preview-${y}-${x}`}
              className={`w-5 h-5 ${
                cell ? COLORS[cell] : "bg-gray-900"
              }`}
            />
          ))
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="game-container animate-fade-in max-w-3xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Tetris</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
            <div className="order-2 md:order-1">
              {renderBoard()}
              
              <div className="flex justify-center mt-6 gap-2">
                <button 
                  className="game-control-button w-12 h-12"
                  onClick={() => movePiece(-1, 0)}
                  disabled={gameStatus !== "playing"}
                >
                  ←
                </button>
                <button 
                  className="game-control-button w-12 h-12"
                  onClick={() => movePiece(0, 1)}
                  disabled={gameStatus !== "playing"}
                >
                  ↓
                </button>
                <button 
                  className="game-control-button w-12 h-12"
                  onClick={rotatePiece}
                  disabled={gameStatus !== "playing"}
                >
                  ↻
                </button>
                <button 
                  className="game-control-button w-12 h-12"
                  onClick={() => movePiece(1, 0)}
                  disabled={gameStatus !== "playing"}
                >
                  →
                </button>
                <button 
                  className="game-control-button w-12 h-12"
                  onClick={hardDrop}
                  disabled={gameStatus !== "playing"}
                >
                  ⇓
                </button>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Next Piece</h3>
                <div className="flex justify-center">
                  {renderNextPiece()}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="mb-3">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-2xl font-bold">{score}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-muted-foreground">Level</div>
                  <div className="text-2xl font-bold">{level}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                  <div className="text-2xl font-bold">{linesCleared}</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Speed</h3>
                <div className="flex gap-2">
                  {(Object.keys(GAME_SPEEDS) as Array<keyof typeof GAME_SPEEDS>).map((speedOption) => (
                    <button
                      key={speedOption}
                      className={`px-3 py-1 rounded-full text-sm ${
                        speed === speedOption
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                      onClick={() => handleSpeedChange(speedOption)}
                      disabled={gameStatus !== "playing"}
                    >
                      {speedOption.charAt(0).toUpperCase() + speedOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleReset} 
                  className="game-control-button flex-1"
                >
                  Restart
                </button>

                {gameStatus !== "over" && (
                  <button 
                    onClick={handlePauseResume} 
                    className="game-control-button flex-1"
                  >
                    {gameStatus === "playing" ? "Pause" : "Resume"}
                  </button>
                )}
              </div>
              
              {gameStatus === "over" && (
                <div className="text-center text-lg font-medium text-red-500">
                  Game Over!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tetris;
