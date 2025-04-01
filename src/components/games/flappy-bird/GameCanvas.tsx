
import { useRef, useEffect } from "react";
import { GameState } from "../../../hooks/games/flappy-bird/useFlappyBirdGame";

interface GameCanvasProps {
  gameState: GameState;
  score: number;
  onJump: () => void;
  onGameOver: () => void;
}

const GameCanvas = ({ gameState, score, onJump, onGameOver }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 320;
    canvas.height = 480;
    
    // Game variables
    let bird: Bird;
    let pipes: Pipe[] = [];
    let gravity = 0.25;
    let speed = 2;
    let animationFrameId: number;
    
    // Bird object
    class Bird {
      x: number;
      y: number;
      width: number;
      height: number;
      velocity: number;
      
      constructor() {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.width = 34;
        this.height = 24;
        this.velocity = 0;
      }
      
      update() {
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Floor collision
        if (this.y + this.height > canvas.height - 90) {
          this.y = canvas.height - this.height - 90;
          this.velocity = 0;
          onGameOver();
        }
        
        // Ceiling collision
        if (this.y < 0) {
          this.y = 0;
          this.velocity = 0;
        }
      }
      
      jump() {
        this.velocity = -4.6;
      }
      
      draw() {
        ctx.fillStyle = "#FFD700"; // Yellow
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird's beak
        ctx.fillStyle = "#FF6347"; // Red-orange
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
        ctx.lineTo(this.x + this.width/2 + 10, this.y + this.height/2);
        ctx.lineTo(this.x + this.width/2, this.y + this.height/2 + 5);
        ctx.fill();
        
        // Bird's eye
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y + this.height/3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird's wing
        ctx.fillStyle = "#FFA500"; // Orange
        ctx.beginPath();
        ctx.ellipse(
          this.x - 5, 
          this.y + this.height/2 + 5, 
          8, 
          5, 
          Math.PI/4, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Pipe object
    class Pipe {
      x: number;
      topHeight: number;
      gap: number;
      width: number;
      
      constructor() {
        this.x = canvas.width;
        this.width = 52;
        this.gap = 120;
        // Random height for top pipe (between 50px and canvas height - gap - 140px)
        this.topHeight = Math.floor(Math.random() * (canvas.height - this.gap - 190)) + 50;
      }
      
      update() {
        this.x -= speed;
      }
      
      draw() {
        // Top pipe
        ctx.fillStyle = "#3CB371"; // Medium sea green
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        // Pipe cap (top)
        ctx.fillStyle = "#2E8B57"; // Sea green (darker)
        ctx.fillRect(this.x - 2, this.topHeight - 10, this.width + 4, 10);
        
        // Bottom pipe
        const bottomPipeY = this.topHeight + this.gap;
        ctx.fillStyle = "#3CB371"; // Medium sea green
        ctx.fillRect(this.x, bottomPipeY, this.width, canvas.height - bottomPipeY);
        
        // Pipe cap (bottom)
        ctx.fillStyle = "#2E8B57"; // Sea green (darker)
        ctx.fillRect(this.x - 2, bottomPipeY, this.width + 4, 10);
      }
      
      checkCollision(bird: Bird) {
        // Collision with top pipe
        if (
          bird.x + bird.width > this.x &&
          bird.x < this.x + this.width &&
          bird.y < this.topHeight
        ) {
          return true;
        }
        
        // Collision with bottom pipe
        const bottomPipeY = this.topHeight + this.gap;
        if (
          bird.x + bird.width > this.x &&
          bird.x < this.x + this.width &&
          bird.y + bird.height > bottomPipeY
        ) {
          return true;
        }
        
        return false;
      }
    }
    
    // Draw background
    const drawBackground = () => {
      // Sky
      ctx.fillStyle = "#87CEEB"; // Sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height - 90);
      
      // Ground
      ctx.fillStyle = "#8B4513"; // Saddle brown
      ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
      
      // Grass
      ctx.fillStyle = "#7CFC00"; // Lawn green
      ctx.fillRect(0, canvas.height - 90, canvas.width, 15);
    };
    
    // Draw waiting screen
    const drawWaitingScreen = () => {
      drawBackground();
      bird.draw();
      
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Click or Press Space to Start", canvas.width / 2, canvas.height / 2);
    };
    
    // Draw game over screen
    const drawGameOverScreen = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#fff";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      
      ctx.font = "16px Arial";
      ctx.fillText("Click or Press Space to Restart", canvas.width / 2, canvas.height / 2 + 50);
    };
    
    // Draw score
    const drawScore = () => {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${score}`, canvas.width / 2, 50);
      ctx.strokeText(`${score}`, canvas.width / 2, 50);
    };
    
    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (gameState === "waiting") {
        drawWaitingScreen();
      } else if (gameState === "playing") {
        // Draw background
        drawBackground();
        
        // Update and draw pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].update();
          pipes[i].draw();
          
          // Remove pipes that are off screen
          if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
          }
          
          // Check for collision
          if (pipes[i].checkCollision(bird)) {
            onGameOver();
          }
        }
        
        // Add new pipe
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
          pipes.push(new Pipe());
        }
        
        // Update and draw bird
        bird.update();
        bird.draw();
        
        // Draw score
        drawScore();
      } else if (gameState === "gameover") {
        // Draw game elements in background
        drawBackground();
        for (const pipe of pipes) {
          pipe.draw();
        }
        bird.draw();
        
        // Draw game over overlay
        drawGameOverScreen();
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Initialize the game
    const initGame = () => {
      bird = new Bird();
      pipes = [];
      gameLoop();
    };
    
    // Start the game loop
    initGame();
    
    // Handle canvas click
    const handleCanvasClick = () => {
      if (gameState === "waiting") {
        onJump(); // This will start the game via the parent component
      } else if (gameState === "playing") {
        bird.jump();
      }
    };
    
    canvas.addEventListener("click", handleCanvasClick);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [gameState, score, onJump, onGameOver]);
  
  return (
    <div className="flex justify-center my-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default GameCanvas;
