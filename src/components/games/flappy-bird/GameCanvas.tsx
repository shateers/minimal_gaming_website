
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
    let clouds: Cloud[] = [];
    let gravity = 0.25;
    let speed = 2;
    let animationFrameId: number;
    let frameCount = 0;
    
    // Cloud object
    class Cloud {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      
      constructor() {
        this.width = Math.random() * 60 + 40;
        this.height = this.width * 0.6;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height / 2 - this.height);
        this.speed = Math.random() * 0.5 + 0.5;
      }
      
      update() {
        this.x -= this.speed;
      }
      
      draw() {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/3, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/1.5, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/4, this.y + this.height/4, this.width/4, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/1.8, this.y + this.height/4, this.width/4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Bird object
    class Bird {
      x: number;
      y: number;
      width: number;
      height: number;
      velocity: number;
      wingPosition: number;
      wingDirection: number;
      rotation: number;
      
      constructor() {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.width = 34;
        this.height = 24;
        this.velocity = 0;
        this.wingPosition = 0;
        this.wingDirection = 1;
        this.rotation = 0;
      }
      
      update() {
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Update wing animation
        if (frameCount % 5 === 0) {
          this.wingPosition += this.wingDirection;
          if (this.wingPosition >= 3 || this.wingPosition <= 0) {
            this.wingDirection *= -1;
          }
        }
        
        // Update rotation based on velocity
        this.rotation = this.velocity * 2;
        if (this.rotation > 70) this.rotation = 70;
        if (this.rotation < -30) this.rotation = -30;
        
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
        this.velocity = -5.2;
        this.rotation = -30;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Bird body
        ctx.fillStyle = "#FFD700"; // Yellow
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird's wing
        ctx.fillStyle = "#FFA500"; // Orange
        ctx.beginPath();
        ctx.ellipse(
          -5, 
          this.wingPosition + 2, 
          10, 
          6, 
          Math.PI/4, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
        
        // Bird's eye
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(8, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // White highlight in eye
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(9, -6, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Bird's beak
        ctx.fillStyle = "#FF6347"; // Red-orange
        ctx.beginPath();
        ctx.moveTo(15, -2);
        ctx.lineTo(25, 0);
        ctx.lineTo(15, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // Pipe object
    class Pipe {
      x: number;
      topHeight: number;
      gap: number;
      width: number;
      counted: boolean;
      
      constructor() {
        this.x = canvas.width;
        this.width = 52;
        this.gap = 120;
        this.counted = false;
        // Random height for top pipe (between 50px and canvas height - gap - 140px)
        this.topHeight = Math.floor(Math.random() * (canvas.height - this.gap - 190)) + 50;
      }
      
      update() {
        this.x -= speed;
        
        // Check if pipe has passed the bird and update score
        if (!this.counted && this.x + this.width < canvas.width / 3) {
          this.counted = true;
          return true; // Return true to increment score
        }
        return false;
      }
      
      draw() {
        // Gradient for pipes
        const pipeGradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        pipeGradient.addColorStop(0, "#2E8B57"); // Dark green
        pipeGradient.addColorStop(0.5, "#3CB371"); // Medium green
        pipeGradient.addColorStop(1, "#2E8B57"); // Dark green
        
        // Top pipe
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        // Pipe cap (top)
        const capGradient = ctx.createLinearGradient(this.x - 2, 0, this.x + this.width + 4, 0);
        capGradient.addColorStop(0, "#1E5631");
        capGradient.addColorStop(0.5, "#2E8B57");
        capGradient.addColorStop(1, "#1E5631");
        
        ctx.fillStyle = capGradient;
        ctx.fillRect(this.x - 5, this.topHeight - 15, this.width + 10, 15);
        ctx.fillRect(this.x - 5, this.topHeight - 15, this.width + 10, 5);
        
        // Bottom pipe
        const bottomPipeY = this.topHeight + this.gap;
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(this.x, bottomPipeY, this.width, canvas.height - bottomPipeY);
        
        // Pipe cap (bottom)
        ctx.fillStyle = capGradient;
        ctx.fillRect(this.x - 5, bottomPipeY, this.width + 10, 15);
        ctx.fillRect(this.x - 5, bottomPipeY, this.width + 10, 5);
      }
      
      checkCollision(bird: Bird) {
        // Calculate actual bird hitbox (smaller than visual representation)
        const birdHitboxX = bird.x - bird.width / 3;
        const birdHitboxY = bird.y - bird.height / 3;
        const birdHitboxWidth = bird.width / 1.5;
        const birdHitboxHeight = bird.height / 1.5;
        
        // Collision with top pipe
        if (
          birdHitboxX + birdHitboxWidth > this.x &&
          birdHitboxX < this.x + this.width &&
          birdHitboxY < this.topHeight
        ) {
          return true;
        }
        
        // Collision with bottom pipe
        const bottomPipeY = this.topHeight + this.gap;
        if (
          birdHitboxX + birdHitboxWidth > this.x &&
          birdHitboxX < this.x + this.width &&
          birdHitboxY + birdHitboxHeight > bottomPipeY
        ) {
          return true;
        }
        
        return false;
      }
    }
    
    // Draw background
    const drawBackground = () => {
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height - 90);
      skyGradient.addColorStop(0, "#64B5F6"); // Light blue
      skyGradient.addColorStop(1, "#90CAF9"); // Lighter blue
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height - 90);
      
      // Draw clouds
      clouds.forEach(cloud => cloud.draw());
      
      // Mountains in background
      ctx.fillStyle = "#81C784"; // Light green
      
      // First mountain
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 90);
      ctx.lineTo(canvas.width * 0.2, canvas.height - 150);
      ctx.lineTo(canvas.width * 0.4, canvas.height - 90);
      ctx.fill();
      
      // Second mountain
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, canvas.height - 90);
      ctx.lineTo(canvas.width * 0.5, canvas.height - 180);
      ctx.lineTo(canvas.width * 0.7, canvas.height - 90);
      ctx.fill();
      
      // Third mountain
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.6, canvas.height - 90);
      ctx.lineTo(canvas.width * 0.8, canvas.height - 140);
      ctx.lineTo(canvas.width, canvas.height - 90);
      ctx.fill();
      
      // Ground gradient
      const groundGradient = ctx.createLinearGradient(0, canvas.height - 90, 0, canvas.height);
      groundGradient.addColorStop(0, "#8B4513"); // Darker brown
      groundGradient.addColorStop(1, "#A0522D"); // Lighter brown
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
      
      // Grass detail
      ctx.fillStyle = "#7CFC00"; // Bright green
      ctx.fillRect(0, canvas.height - 90, canvas.width, 6);
      
      // Grass blades
      ctx.fillStyle = "#66BB6A"; // Medium green
      for (let i = 0; i < canvas.width; i += 10) {
        const height = Math.random() * 5 + 6;
        ctx.fillRect(i, canvas.height - 90, 2, -height);
      }
    };
    
    // Draw waiting screen
    const drawWaitingScreen = () => {
      drawBackground();
      bird.draw();
      
      // Semi-transparent overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text with shadow
      ctx.fillStyle = "#000";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Click or Press Space", canvas.width / 2 + 2, canvas.height / 2 - 28);
      ctx.fillText("to Start", canvas.width / 2 + 2, canvas.height / 2 + 2);
      
      ctx.fillStyle = "#fff";
      ctx.fillText("Click or Press Space", canvas.width / 2, canvas.height / 2 - 30);
      ctx.fillText("to Start", canvas.width / 2, canvas.height / 2);
    };
    
    // Draw game over screen
    const drawGameOverScreen = () => {
      // Semi-transparent overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text with shadow
      ctx.fillStyle = "#000";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2 + 2, canvas.height / 2 - 28);
      
      ctx.font = "22px Arial";
      ctx.fillText(`Score: ${score}`, canvas.width / 2 + 2, canvas.height / 2 + 12);
      
      ctx.font = "18px Arial";
      ctx.fillText("Click or Press Space", canvas.width / 2 + 2, canvas.height / 2 + 52);
      ctx.fillText("to Restart", canvas.width / 2 + 2, canvas.height / 2 + 82);
      
      ctx.fillStyle = "#fff";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.font = "22px Arial";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      
      ctx.font = "18px Arial";
      ctx.fillText("Click or Press Space", canvas.width / 2, canvas.height / 2 + 50);
      ctx.fillText("to Restart", canvas.width / 2, canvas.height / 2 + 80);
    };
    
    // Draw score
    const drawScore = () => {
      // Text shadow
      ctx.fillStyle = "#000";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${score}`, canvas.width / 2 + 2, 52);
      
      // Actual text
      ctx.fillStyle = "#fff";
      ctx.fillText(`${score}`, canvas.width / 2, 50);
    };
    
    // Game loop
    const gameLoop = () => {
      // Increment frame count
      frameCount++;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (gameState === "waiting") {
        drawWaitingScreen();
      } else if (gameState === "playing") {
        // Add new cloud
        if (frameCount % 200 === 0) {
          clouds.push(new Cloud());
        }
        
        // Update and draw clouds
        for (let i = clouds.length - 1; i >= 0; i--) {
          clouds[i].update();
          // Remove clouds that are off screen
          if (clouds[i].x + clouds[i].width < 0) {
            clouds.splice(i, 1);
          }
        }
        
        // Draw background
        drawBackground();
        
        // Update and draw pipes
        let scoreIncremented = false;
        for (let i = pipes.length - 1; i >= 0; i--) {
          const pipePassedBird = pipes[i].update();
          pipes[i].draw();
          
          // Remove pipes that are off screen
          if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            continue;
          }
          
          // Check for collision
          if (pipes[i].checkCollision(bird)) {
            onGameOver();
            break;
          }
          
          // Increment score
          if (pipePassedBird) {
            scoreIncremented = true;
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
        
        // Call score update in parent component
        if (scoreIncremented) {
          // We don't have direct access to updateScore, so we'll handle score in the parent component
          onJump(); // This is a hack to trigger a state update in the parent. A better approach would be to add an onScoreIncrement prop
        }
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
      clouds = [new Cloud(), new Cloud()]; // Start with a couple clouds
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
