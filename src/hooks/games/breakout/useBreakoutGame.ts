import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveGameScore } from '@/services/scoreService';
import { toast } from 'sonner';

// Types for game elements
export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strength: number;
  destroyed: boolean;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  speed: number;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  bricks: Brick[];
  ball: Ball;
  paddle: Paddle;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isLevelCompleted: boolean;
  restartDelay: number;
}

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLUMNS = 10;
const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLUMNS - 5;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 5;
const BRICK_TOP_OFFSET = 70;
const BRICK_LEFT_OFFSET = 2.5;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;
const RESTART_DELAY = 3; // seconds
const POWERUP_CHANCE = 0.1;

// Colors
const BRICK_COLORS = [
  '#FF5252', // Red
  '#FF7F3F', // Orange
  '#FFEB3B', // Yellow
  '#66BB6A', // Green
  '#42A5F5', // Blue
];

export const useBreakoutGame = () => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    bricks: [],
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
      radius: BALL_RADIUS,
      dx: BALL_SPEED,
      dy: -BALL_SPEED,
      speed: BALL_SPEED,
    },
    paddle: {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dx: 0,
      speed: PADDLE_SPEED,
    },
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isLevelCompleted: false,
    restartDelay: 0,
  });

  const keysPressed = useRef<Record<string, boolean>>({});

  // Initialize bricks
  const initializeBricks = useCallback((level: number) => {
    const bricks: Brick[] = [];
    const strengthMultiplier = Math.min(Math.ceil(level / 2), 3);
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLUMNS; col++) {
        const strength = Math.min(row + 1, 3) * strengthMultiplier;
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_LEFT_OFFSET,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_TOP_OFFSET,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
          strength,
          destroyed: false,
        });
      }
    }
    return bricks;
  }, []);

  // Reset ball position
  const resetBall = useCallback(() => {
    return {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
      radius: BALL_RADIUS,
      dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
      dy: -BALL_SPEED,
      speed: BALL_SPEED,
    };
  }, []);

  // Initialize game
  const initializeGame = useCallback((level: number = 1) => {
    const bricks = initializeBricks(level);
    
    setGameState(prev => ({
      ...prev,
      score: prev.score,
      lives: prev.lives,
      level,
      bricks,
      ball: resetBall(),
      paddle: {
        x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        dx: 0,
        speed: PADDLE_SPEED,
      },
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      isLevelCompleted: false,
      restartDelay: 0,
    }));
  }, [initializeBricks, resetBall]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      bricks: initializeBricks(1),
      ball: resetBall(),
      paddle: {
        x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        dx: 0,
        speed: PADDLE_SPEED,
      },
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isLevelCompleted: false,
      restartDelay: 0,
    });
  }, [initializeBricks, resetBall]);

  // Start or pause game
  const toggleGame = useCallback(() => {
    if (gameState.isGameOver) {
      resetGame();
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      isPlaying: !prev.isPaused,
      isPaused: !prev.isPaused,
    }));
  }, [gameState.isGameOver, resetGame]);

  // Update paddle position
  const updatePaddle = useCallback(() => {
    setGameState(prev => {
      const { paddle } = prev;
      let newX = paddle.x + paddle.dx;
      
      // Keep paddle within canvas bounds
      if (newX < 0) {
        newX = 0;
      } else if (newX + paddle.width > CANVAS_WIDTH) {
        newX = CANVAS_WIDTH - paddle.width;
      }
      
      return {
        ...prev,
        paddle: {
          ...paddle,
          x: newX,
        },
      };
    });
  }, []);

  // Check collision between ball and brick
  const checkBrickCollision = useCallback((ball: Ball, brick: Brick) => {
    if (brick.destroyed) return false;
    
    const ballLeft = ball.x - ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    
    const brickLeft = brick.x;
    const brickRight = brick.x + brick.width;
    const brickTop = brick.y;
    const brickBottom = brick.y + brick.height;
    
    return (
      ballRight > brickLeft &&
      ballLeft < brickRight &&
      ballBottom > brickTop &&
      ballTop < brickBottom
    );
  }, []);

  // Detect collision side
  const getCollisionSide = useCallback((ball: Ball, brick: Brick) => {
    const ballCenterX = ball.x;
    const ballCenterY = ball.y;
    const brickCenterX = brick.x + brick.width / 2;
    const brickCenterY = brick.y + brick.height / 2;
    
    const dx = ballCenterX - brickCenterX;
    const dy = ballCenterY - brickCenterY;
    const width = (ball.radius + brick.width / 2);
    const height = (ball.radius + brick.height / 2);
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        return crossWidth > -crossHeight ? 'bottom' : 'left';
      } else {
        return crossWidth > -crossHeight ? 'right' : 'top';
      }
    }
    
    return null;
  }, []);

  // Update ball position and check collisions
  const updateBall = useCallback(() => {
    setGameState(prev => {
      const { ball, paddle, bricks, score, lives } = prev;
      let newScore = score;
      let newLives = lives;
      let newBall = { ...ball };
      let newBricks = [...bricks];
      let isLevelCompleted = prev.isLevelCompleted;
      let isGameOver = prev.isGameOver;
      let restartDelay = prev.restartDelay;
      
      // Move ball
      newBall.x += newBall.dx;
      newBall.y += newBall.dy;
      
      // Collision with walls
      if (newBall.x + newBall.radius > CANVAS_WIDTH || newBall.x - newBall.radius < 0) {
        newBall.dx = -newBall.dx;
      }
      
      if (newBall.y - newBall.radius < 0) {
        newBall.dy = -newBall.dy;
      }
      
      // Collision with paddle
      if (
        newBall.y + newBall.radius > paddle.y &&
        newBall.y + newBall.radius < paddle.y + paddle.height &&
        newBall.x > paddle.x &&
        newBall.x < paddle.x + paddle.width
      ) {
        // Adjust ball direction based on where it hit the paddle
        const hitPoint = (newBall.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const angle = hitPoint * (Math.PI / 3); // Max angle: 60 degrees
        
        newBall.dx = newBall.speed * Math.sin(angle);
        newBall.dy = -newBall.speed * Math.cos(angle);
      }
      
      // Collision with bricks
      newBricks = newBricks.map(brick => {
        if (checkBrickCollision(newBall, brick) && !brick.destroyed) {
          const collisionSide = getCollisionSide(newBall, brick);
          
          // Change ball direction based on collision side
          if (collisionSide === 'left' || collisionSide === 'right') {
            newBall.dx = -newBall.dx;
          } else if (collisionSide === 'top' || collisionSide === 'bottom') {
            newBall.dy = -newBall.dy;
          }
          
          // Reduce brick strength or destroy it
          const newStrength = brick.strength - 1;
          const destroyed = newStrength <= 0;
          
          if (destroyed) {
            newScore += 10 * prev.level;
          } else {
            newScore += 1 * prev.level;
          }
          
          return {
            ...brick,
            strength: newStrength,
            destroyed,
          };
        }
        return brick;
      });
      
      // Check if ball fell off the bottom
      if (newBall.y + newBall.radius > CANVAS_HEIGHT) {
        newLives--;
        
        if (newLives <= 0) {
          isGameOver = true;
          toast.error("Game Over!");
          
          // Save score if authenticated
          if (user) {
            saveGameScore({
              user_id: user.id,
              game_name: "breakout",
              score: newScore,
              completed: false,
            });
          }
        } else {
          // Reset ball
          newBall = resetBall();
          restartDelay = RESTART_DELAY;
        }
      }
      
      // Check if level is completed
      const remainingBricks = newBricks.filter(brick => !brick.destroyed).length;
      if (remainingBricks === 0 && !isLevelCompleted) {
        isLevelCompleted = true;
        toast.success(`Level ${prev.level} completed!`);
        restartDelay = RESTART_DELAY;
        
        // Save score if authenticated
        if (user) {
          saveGameScore({
            user_id: user.id,
            game_name: "breakout",
            score: newScore,
            completed: true,
          });
        }
      }
      
      return {
        ...prev,
        ball: newBall,
        bricks: newBricks,
        score: newScore,
        lives: newLives,
        isGameOver,
        isLevelCompleted,
        restartDelay,
      };
    });
  }, [checkBrickCollision, getCollisionSide, resetBall, user]);

  // Handle countdown
  const handleCountdown = useCallback(() => {
    setGameState(prev => {
      if (prev.restartDelay <= 0) {
        // If level completed, increase level and initialize new level
        if (prev.isLevelCompleted) {
          const newLevel = prev.level + 1;
          return {
            ...prev,
            level: newLevel,
            bricks: initializeBricks(newLevel),
            ball: resetBall(),
            isLevelCompleted: false,
            restartDelay: 0,
          };
        }
        return prev;
      }
      
      return {
        ...prev,
        restartDelay: prev.restartDelay - (1/60), // Approximate for 60 FPS
      };
    });
  }, [initializeBricks, resetBall]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastTimeRef.current;
    
    if (elapsed > 1000 / 60) { // 60 FPS
      if (gameState.isPlaying && !gameState.isPaused) {
        if (gameState.restartDelay > 0) {
          handleCountdown();
        } else if (!gameState.isGameOver && !gameState.isLevelCompleted) {
          updatePaddle();
          updateBall();
        }
      }
      
      lastTimeRef.current = timestamp;
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, handleCountdown, updateBall, updatePaddle]);

  // Key event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = true;
    
    if (e.key === 'ArrowLeft') {
      setGameState(prev => ({
        ...prev,
        paddle: {
          ...prev.paddle,
          dx: -prev.paddle.speed,
        },
      }));
    } else if (e.key === 'ArrowRight') {
      setGameState(prev => ({
        ...prev,
        paddle: {
          ...prev.paddle,
          dx: prev.paddle.speed,
        },
      }));
    } else if (e.key === ' ' || e.key === 'Enter') {
      // Start game if showing instructions
      if (showInstructions) {
        setShowInstructions(false);
        setGameState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }));
      } else if (gameState.isGameOver) {
        resetGame();
        setGameState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }));
      } else {
        toggleGame();
      }
    }
  }, [gameState.isGameOver, resetGame, showInstructions, toggleGame]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key] = false;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setGameState(prev => ({
        ...prev,
        paddle: {
          ...prev.paddle,
          dx: 0,
        },
      }));
    }
  }, []);

  // Render game
  const renderGame = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw bricks
    gameState.bricks.forEach(brick => {
      if (!brick.destroyed) {
        const opacity = 0.5 + (0.5 * brick.strength / 3);
        ctx.fillStyle = brick.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        
        // Draw brick strength indicator
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          brick.strength.toString(),
          brick.x + brick.width / 2,
          brick.y + brick.height / 2
        );
      }
    });
    
    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.x,
      gameState.paddle.y + gameState.paddle.height
    );
    paddleGradient.addColorStop(0, '#4285F4');
    paddleGradient.addColorStop(1, '#0D47A1');
    
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(
      gameState.paddle.x,
      gameState.paddle.y,
      gameState.paddle.width,
      gameState.paddle.height
    );
    
    // Draw ball
    const ballGradient = ctx.createRadialGradient(
      gameState.ball.x,
      gameState.ball.y,
      0,
      gameState.ball.x,
      gameState.ball.y,
      gameState.ball.radius
    );
    ballGradient.addColorStop(0, '#FFF');
    ballGradient.addColorStop(1, '#FF5252');
    
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(
      gameState.ball.x,
      gameState.ball.y,
      gameState.ball.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw score, lives, and level
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${gameState.score}`, 10, 10);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 30);
    ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH - 100, 10);
    
    // Draw restart countdown
    if (gameState.restartDelay > 0) {
      const countdown = Math.ceil(gameState.restartDelay);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (gameState.isLevelCompleted) {
        ctx.fillText(
          `Level ${gameState.level} Completed!`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 - 40
        );
        ctx.fillText(
          `Level ${gameState.level + 1} starts in ${countdown}...`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 40
        );
      } else {
        ctx.fillText(
          `Lives: ${gameState.lives}`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 - 40
        );
        ctx.fillText(
          `Continuing in ${countdown}...`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 40
        );
      }
    }
    
    // Draw game over screen
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText(
        `Final Score: ${gameState.score}`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 20
      );
      
      ctx.font = '18px Arial';
      ctx.fillText(
        'Press Space or Enter to play again',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 70
      );
    }
    
    // Draw instructions overlay
    if (showInstructions) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Breakout', CANVAS_WIDTH / 2, 100);
      
      ctx.font = '20px Arial';
      ctx.fillText('Instructions:', CANVAS_WIDTH / 2, 160);
      
      const instructions = [
        'Use Arrow Keys to move the paddle left and right',
        'Break all the bricks to complete the level',
        'Some bricks require multiple hits to break',
        'Don\'t let the ball fall off the bottom!',
        'Press Space or Enter to start/pause the game',
      ];
      
      instructions.forEach((instruction, index) => {
        ctx.fillText(
          instruction,
          CANVAS_WIDTH / 2,
          220 + index * 40
        );
      });
      
      ctx.font = 'bold 24px Arial';
      ctx.fillText(
        'Press Space or Enter to start',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 100
      );
    }
  }, [gameState, showInstructions]);

  // Initialize canvas and event listeners
  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
      
      // Set canvas dimensions
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;
      
      // Initialize game
      resetGame();
    }
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, resetGame]);

  // Start game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Render game
  useEffect(() => {
    renderGame();
  }, [renderGame]);

  return {
    canvasRef,
    gameState,
    showInstructions,
    setShowInstructions,
    resetGame,
    toggleGame,
  };
};
