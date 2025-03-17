
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useIsMobile } from "../../hooks/use-mobile";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150; // milliseconds between moves
const SPEED_INCREMENT = 5; // milliseconds to decrease per food eaten

const Snake = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "paused" | "over">("idle");
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>("RIGHT");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<Position | null>(null);

  // Generate random food position that isn't on the snake
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if the new food position is on the snake
      const onSnake = snake.some(segment => 
        segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    } while (true);
    
    return newFood;
  }, [snake]);

  // Start game
  const startGame = () => {
    if (gameStatus === "over" || gameStatus === "idle") {
      setSnake([{ x: 10, y: 10 }]);
      setFood(generateFood());
      setDirection("RIGHT");
      lastDirectionRef.current = "RIGHT";
      setScore(0);
      setSpeed(INITIAL_SPEED);
      setTimer(0);
      setGameStatus("playing");
      
      // Start timer
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  // Pause/resume game
  const togglePause = () => {
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
      
      // Resume timer
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      
      // Resume game loop
      lastTimeRef.current = 0;
      gameLoop(0);
    }
  };

  // Handle direction change
  const handleDirectionChange = (newDirection: Direction) => {
    if (gameStatus !== "playing") return;
    
    // Prevent 180-degree turns
    switch (newDirection) {
      case "UP":
        if (lastDirectionRef.current !== "DOWN") {
          setDirection("UP");
        }
        break;
      case "DOWN":
        if (lastDirectionRef.current !== "UP") {
          setDirection("DOWN");
        }
        break;
      case "LEFT":
        if (lastDirectionRef.current !== "RIGHT") {
          setDirection("LEFT");
        }
        break;
      case "RIGHT":
        if (lastDirectionRef.current !== "LEFT") {
          setDirection("RIGHT");
        }
        break;
    }
  };

  // Handle keydown events for controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "playing") return;
      
      // Prevent default behavior for arrow keys to stop page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case "ArrowUp":
          handleDirectionChange("UP");
          break;
        case "ArrowDown":
          handleDirectionChange("DOWN");
          break;
        case "ArrowLeft":
          handleDirectionChange("LEFT");
          break;
        case "ArrowRight":
          handleDirectionChange("RIGHT");
          break;
        case " ": // Space bar to pause/resume
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStatus]);

  // Handle touch events for mobile controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (gameStatus !== "playing") return;
      
      // Prevent default behavior to stop page scrolling
      e.preventDefault();
      
      const touch = e.touches[0];
      touchStartRef.current = { 
        x: touch.clientX, 
        y: touch.clientY 
      };
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (gameStatus !== "playing" || !touchStartRef.current) return;
      
      // Prevent default behavior to stop page scrolling
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      
      const dx = endX - touchStartRef.current.x;
      const dy = endY - touchStartRef.current.y;
      
      // Determine if the swipe was horizontal or vertical
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) {
          handleDirectionChange("RIGHT");
        } else {
          handleDirectionChange("LEFT");
        }
      } else {
        // Vertical swipe
        if (dy > 0) {
          handleDirectionChange("DOWN");
        } else {
          handleDirectionChange("UP");
        }
      }
      
      touchStartRef.current = null;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default behavior to stop page scrolling when playing the game
      if (gameStatus === "playing") {
        e.preventDefault();
      }
    };
    
    const canvas = canvasRef.current;
    if (canvas && isMobile) {
      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [gameStatus, isMobile]);

  // Set page title
  useEffect(() => {
    document.title = "Snake - GameHub";
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Time tracking for game loop
  const lastTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Main game loop using requestAnimationFrame
  const gameLoop = useCallback((currentTime: number) => {
    if (gameStatus !== "playing") return;
    
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    accumulatedTimeRef.current += deltaTime;
    
    if (accumulatedTimeRef.current >= speed) {
      accumulatedTimeRef.current = 0;
      
      // Move the snake
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      
      // Update head position based on direction
      switch (direction) {
        case "UP":
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "DOWN":
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        case "LEFT":
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "RIGHT":
          head.x = (head.x + 1) % GRID_SIZE;
          break;
      }
      
      // Save the last processed direction
      lastDirectionRef.current = direction;
      
      // Check for collision with self
      if (
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameStatus("over");
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        return;
      }
      
      // Add new head
      newSnake.unshift(head);
      
      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        // Generate new food
        setFood(generateFood());
        
        // Increase score
        setScore(prev => prev + 1);
        
        // Increase speed (decrease milliseconds)
        setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50));
      } else {
        // Remove tail
        newSnake.pop();
      }
      
      setSnake(newSnake);
    }
    
    // Draw the game
    drawGame();
    
    // Continue the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [snake, food, direction, gameStatus, speed, generateFood]);

  // Start game loop when status changes to playing
  useEffect(() => {
    if (gameStatus === "playing") {
      lastTimeRef.current = 0;
      accumulatedTimeRef.current = 0;
      gameLoop(0);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStatus, gameLoop]);

  // Draw the game on the canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid lines (subtle)
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw snake
    ctx.fillStyle = "#000";
    snake.forEach((segment, index) => {
      // Draw rounded segments
      const radius = index === 0 ? 8 : 6; // Head is slightly larger
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
        radius
      );
      ctx.fill();
      
      // Draw eyes on the head
      if (index === 0) {
        ctx.fillStyle = "#fff";
        
        // Position eyes based on direction
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        switch (lastDirectionRef.current) {
          case "UP":
            eyeX1 = segment.x * CELL_SIZE + 6;
            eyeY1 = segment.y * CELL_SIZE + 6;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 6;
            eyeY2 = segment.y * CELL_SIZE + 6;
            break;
          case "DOWN":
            eyeX1 = segment.x * CELL_SIZE + 6;
            eyeY1 = segment.y * CELL_SIZE + CELL_SIZE - 6;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 6;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 6;
            break;
          case "LEFT":
            eyeX1 = segment.x * CELL_SIZE + 6;
            eyeY1 = segment.y * CELL_SIZE + 6;
            eyeX2 = segment.x * CELL_SIZE + 6;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 6;
            break;
          case "RIGHT":
          default:
            eyeX1 = segment.x * CELL_SIZE + CELL_SIZE - 6;
            eyeY1 = segment.y * CELL_SIZE + 6;
            eyeX2 = segment.x * CELL_SIZE + CELL_SIZE - 6;
            eyeY2 = segment.y * CELL_SIZE + CELL_SIZE - 6;
            break;
        }
        
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#000";
      }
    });
    
    // Draw food
    ctx.fillStyle = "#FF5757";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add a shine effect to the food
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2 - 3,
      food.y * CELL_SIZE + CELL_SIZE / 2 - 3,
      2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // If game is paused, draw a semi-transparent overlay
    if (gameStatus === "paused") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    }
    
    // If game is over, draw a semi-transparent overlay
    if (gameStatus === "over") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.font = "18px sans-serif";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [snake, food, gameStatus, score]);

  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              <h1 className="text-3xl font-bold">Snake</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Score: {score}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative border border-border rounded-md overflow-hidden shadow-sm">
              <canvas
                ref={canvasRef}
                width={GRID_SIZE * CELL_SIZE}
                height={GRID_SIZE * CELL_SIZE}
                className="bg-white"
              />
              
              {gameStatus === "idle" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <button 
                    onClick={startGame}
                    className="button-hover px-8 py-3 bg-black text-white rounded-full font-medium"
                  >
                    Start Game
                  </button>
                </div>
              )}
            </div>
          </div>

          {isMobile && gameStatus === "playing" && (
            <div className="mb-8">
              <div className="flex justify-center">
                <button 
                  onClick={() => handleDirectionChange("UP")}
                  className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-md active:scale-95 transition-transform"
                  aria-label="Up"
                >
                  ↑
                </button>
              </div>
              <div className="flex justify-center gap-8 my-2">
                <button 
                  onClick={() => handleDirectionChange("LEFT")}
                  className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-md active:scale-95 transition-transform"
                  aria-label="Left"
                >
                  ←
                </button>
                <button 
                  onClick={() => handleDirectionChange("RIGHT")}
                  className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-md active:scale-95 transition-transform"
                  aria-label="Right"
                >
                  →
                </button>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => handleDirectionChange("DOWN")}
                  className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl shadow-md active:scale-95 transition-transform"
                  aria-label="Down"
                >
                  ↓
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center mb-2">
              {gameStatus === "over" && (
                <div className="text-lg font-medium">Game Over! Final Score: {score}</div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {gameStatus !== "idle" && (
                <button 
                  onClick={startGame} 
                  className="game-control-button"
                >
                  Restart
                </button>
              )}

              {(gameStatus === "playing" || gameStatus === "paused") && (
                <button 
                  onClick={togglePause} 
                  className="game-control-button"
                >
                  {gameStatus === "playing" ? "Pause" : "Resume"}
                </button>
              )}
            </div>
            
            <div className="mt-6 text-muted-foreground text-sm max-w-md text-center">
              <p><strong>Controls:</strong> {isMobile ? "Use the on-screen buttons or swipe" : "Use the arrow keys"} to move the snake. Collect the red food to grow and earn points.</p>
              <p className="mt-2"><strong>Tip:</strong> {isMobile ? "Tap the Pause button" : "Press the spacebar"} to pause/resume the game.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Snake;
