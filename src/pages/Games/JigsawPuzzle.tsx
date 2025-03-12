
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// Define types for the jigsaw puzzle
type Piece = {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  width: number;
  height: number;
  isPlaced: boolean;
};

type DifficultyLevel = "easy" | "medium" | "hard";
type ImageOption = "nature" | "abstract" | "animals";

const DIFFICULTY_SETTINGS = {
  easy: { rows: 3, cols: 3 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 5, cols: 5 },
};

const IMAGE_URLS = {
  nature: "https://images.unsplash.com/photo-1500829243541-74b677fecc30",
  abstract: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3",
  animals: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef3",
};

const JigsawPuzzle = () => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "over">("playing");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [image, setImage] = useState<ImageOption>("nature");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [moves, setMoves] = useState(0);
  
  const puzzleAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Initialize the puzzle
  const initPuzzle = useCallback(() => {
    if (!imageRef.current || !imageLoaded) return;
    
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;
    const totalPieces = rows * cols;
    const newPieces: Piece[] = [];
    
    // Create puzzle pieces
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const id = i * cols + j;
        
        newPieces.push({
          id,
          x: Math.random() * (canvasWidth - pieceWidth), // Random position
          y: canvasHeight + Math.random() * 100 + 50,    // Below the puzzle area
          correctX: j * pieceWidth,
          correctY: i * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          isPlaced: false,
        });
      }
    }
    
    // Shuffle the pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].x, newPieces[j].x] = [newPieces[j].x, newPieces[i].x];
      [newPieces[i].y, newPieces[j].y] = [newPieces[j].y, newPieces[i].y];
    }
    
    setPieces(newPieces);
    setSelectedPiece(null);
    setIsDragging(false);
    setGameStatus("playing");
    setMoves(0);
    drawPuzzle(newPieces);
  }, [difficulty, imageLoaded]);

  // Load the image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${IMAGE_URLS[image]}?w=${canvasWidth}&h=${canvasHeight}&fit=crop&crop=entropy`;
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [image]);

  // Initialize the game
  useEffect(() => {
    document.title = "Jigsaw Puzzle - GameHub";
    
    if (imageLoaded) {
      initPuzzle();
    }
    
    // Start timer
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [imageLoaded, initPuzzle]);

  // Check if the puzzle is complete
  useEffect(() => {
    if (pieces.length > 0 && pieces.every(piece => piece.isPlaced)) {
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  }, [pieces, timerInterval]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (pieces.length > 0) {
        drawPuzzle(pieces);
      }
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pieces]);

  // Draw the puzzle
  const drawPuzzle = (piecesToDraw: Piece[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw puzzle board background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid lines
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty];
    const pieceWidth = canvasWidth / cols;
    const pieceHeight = canvasHeight / rows;
    
    for (let i = 1; i < rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * pieceHeight);
      ctx.lineTo(canvasWidth, i * pieceHeight);
      ctx.stroke();
    }
    
    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pieceWidth, 0);
      ctx.lineTo(i * pieceWidth, canvasHeight);
      ctx.stroke();
    }
    
    // Draw pieces
    piecesToDraw.forEach(piece => {
      ctx.save();
      
      // Create a clipping region for the piece
      ctx.beginPath();
      ctx.rect(piece.x, piece.y, piece.width, piece.height);
      ctx.clip();
      
      // Draw the image section for this piece
      ctx.drawImage(
        imageRef.current!,
        piece.correctX, piece.correctY, piece.width, piece.height,
        piece.x, piece.y, piece.width, piece.height
      );
      
      // Draw border around the piece
      ctx.strokeStyle = selectedPiece === piece.id ? "#ff6b6b" : "#333333";
      ctx.lineWidth = selectedPiece === piece.id ? 3 : 1;
      ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
      
      ctx.restore();
    });
  };

  // Handle mouse down on a piece
  const handleMouseDown = (e: React.MouseEvent) => {
    if (gameStatus !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if the mouse is over a piece
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      
      if (
        mouseX >= piece.x && mouseX <= piece.x + piece.width &&
        mouseY >= piece.y && mouseY <= piece.y + piece.height
      ) {
        // Don't allow moving pieces that are already placed correctly
        if (piece.isPlaced) continue;
        
        setSelectedPiece(piece.id);
        setIsDragging(true);
        setDragOffset({
          x: mouseX - piece.x,
          y: mouseY - piece.y,
        });
        
        // Move the selected piece to the end of the array to draw it on top
        const newPieces = [...pieces];
        const selectedPieceIndex = newPieces.findIndex(p => p.id === piece.id);
        const [selectedPieceObj] = newPieces.splice(selectedPieceIndex, 1);
        newPieces.push(selectedPieceObj);
        
        setPieces(newPieces);
        drawPuzzle(newPieces);
        
        break;
      }
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedPiece === null || gameStatus !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newPieces = [...pieces];
    const piece = newPieces.find(p => p.id === selectedPiece);
    
    if (piece) {
      // Update piece position
      piece.x = mouseX - dragOffset.x;
      piece.y = mouseY - dragOffset.y;
      
      setPieces(newPieces);
      drawPuzzle(newPieces);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDragging || selectedPiece === null || gameStatus !== "playing") return;
    
    const newPieces = [...pieces];
    const piece = newPieces.find(p => p.id === selectedPiece);
    
    if (piece) {
      // Check if the piece is close to its correct position
      const distanceX = Math.abs(piece.x - piece.correctX);
      const distanceY = Math.abs(piece.y - piece.correctY);
      
      // If the piece is within 30 pixels of its correct position, snap it into place
      if (distanceX < 30 && distanceY < 30) {
        piece.x = piece.correctX;
        piece.y = piece.correctY;
        piece.isPlaced = true;
      }
      
      // Increment moves counter
      setMoves(prev => prev + 1);
      
      setPieces(newPieces);
      drawPuzzle(newPieces);
    }
    
    setSelectedPiece(null);
    setIsDragging(false);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Reset the puzzle
  const handleReset = () => {
    setGameStatus("playing");
    setTimer(0);
    setMoves(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    initPuzzle();
  };

  // Handle pause/resume
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

  // Change difficulty
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    handleReset();
  };

  // Change image
  const handleImageChange = (newImage: ImageOption) => {
    setImage(newImage);
    setImageLoaded(false);
  };

  // Toggle preview
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (pieces.length === 0) return 0;
    const placedPieces = pieces.filter(piece => piece.isPlaced).length;
    return Math.round((placedPieces / pieces.length) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="game-container animate-fade-in">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Jigsaw Puzzle</h1>
            </div>

            <div className="flex items-center gap-4">
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
          </div>

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Difficulty:</div>
              <div className="flex gap-2">
                {(Object.keys(DIFFICULTY_SETTINGS) as Array<DifficultyLevel>).map(level => (
                  <button
                    key={level}
                    className={`px-3 py-1 rounded-full text-sm ${
                      difficulty === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                    onClick={() => handleDifficultyChange(level)}
                    disabled={gameStatus === "playing" && getCompletionPercentage() > 0}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Image:</div>
              <div className="flex gap-2">
                {(Object.keys(IMAGE_URLS) as Array<ImageOption>).map(img => (
                  <button
                    key={img}
                    className={`px-3 py-1 rounded-full text-sm ${
                      image === img
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                    onClick={() => handleImageChange(img)}
                    disabled={gameStatus === "playing" && getCompletionPercentage() > 0}
                  >
                    {img.charAt(0).toUpperCase() + img.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div 
            ref={puzzleAreaRef} 
            className="relative mb-6 mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
            style={{ width: canvasWidth, height: canvasHeight + 150 }}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight + 150}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className={`${gameStatus === "paused" ? "opacity-50" : ""}`}
            />
            
            {gameStatus === "paused" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="text-2xl font-bold text-white">PAUSED</div>
              </div>
            )}
            
            {previewVisible && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center p-4">
                {imageRef.current && (
                  <img
                    src={imageRef.current.src}
                    alt="Puzzle preview"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                <button
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full"
                  onClick={togglePreview}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md bg-secondary/30 h-4 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            
            <div className="text-center mb-2">
              {gameStatus === "over" ? (
                <div className="text-xl font-medium text-green-600">
                  Puzzle complete! Congratulations!
                </div>
              ) : (
                <div className="text-lg font-medium">
                  {getCompletionPercentage()}% complete
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
              
              <button 
                onClick={togglePreview} 
                className="game-control-button"
              >
                {previewVisible ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JigsawPuzzle;
