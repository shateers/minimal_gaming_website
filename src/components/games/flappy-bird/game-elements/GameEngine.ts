
import { BirdClass } from "./Bird";
import { PipeClass } from "./Pipe";
import { CloudClass } from "./Cloud";
import { Background } from "./Background";
import { ScoreUI, WaitingScreen, GameOverScreen } from "./GameUI";
import { GameState } from "../../../../hooks/games/flappy-bird/useFlappyBirdGame";

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bird: BirdClass;
  pipes: PipeClass[];
  clouds: CloudClass[];
  frameCount: number;
  animationFrameId: number;
  gameState: GameState;
  score: number;
  
  gravity: number;
  speed: number;
  
  onJump: () => void;
  onGameOver: () => void;
  
  constructor(
    canvas: HTMLCanvasElement, 
    gameState: GameState, 
    score: number, 
    onJump: () => void, 
    onGameOver: () => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gameState = gameState;
    this.score = score;
    this.onJump = onJump;
    this.onGameOver = onGameOver;
    
    // Set canvas dimensions to 800x500 as requested
    this.canvas.width = 800;
    this.canvas.height = 500;
    
    // Game variables
    this.bird = new BirdClass(this.canvas.width, this.canvas.height);
    this.pipes = [];
    this.clouds = [
      new CloudClass(this.canvas.width, this.canvas.height),
      new CloudClass(this.canvas.width, this.canvas.height)
    ];
    this.gravity = 0.25;
    this.speed = 2;
    this.frameCount = 0;
    this.animationFrameId = 0;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start game loop
    this.gameLoop();
  }
  
  setupEventListeners() {
    const handleCanvasClick = () => {
      if (this.gameState === "waiting") {
        this.onJump(); // This will start the game via the parent component
      } else if (this.gameState === "playing") {
        this.bird.jump();
      }
    };
    
    this.canvas.addEventListener("click", handleCanvasClick);
  }
  
  cleanupEventListeners() {
    // Remove event listeners when cleaning up
    this.canvas.replaceWith(this.canvas.cloneNode(true));
  }
  
  updateGameState(newGameState: GameState) {
    this.gameState = newGameState;
  }
  
  updateScore(newScore: number) {
    this.score = newScore;
  }
  
  gameLoop = () => {
    // Increment frame count
    this.frameCount++;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.gameState === "waiting") {
      this.renderWaitingState();
    } else if (this.gameState === "playing") {
      this.renderPlayingState();
    } else if (this.gameState === "gameover") {
      this.renderGameOverState();
    }
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };
  
  renderWaitingState() {
    Background({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      clouds: this.clouds
    });
    
    this.bird.draw(this.ctx);
    
    WaitingScreen({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    });
  }
  
  renderPlayingState() {
    // Add new cloud
    if (this.frameCount % 200 === 0) {
      this.clouds.push(new CloudClass(this.canvas.width, this.canvas.height));
    }
    
    // Update and draw clouds
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      this.clouds[i].update();
      // Remove clouds that are off screen
      if (this.clouds[i].x + this.clouds[i].width < 0) {
        this.clouds.splice(i, 1);
      }
    }
    
    // Draw background
    Background({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      clouds: this.clouds
    });
    
    // Update and draw pipes
    let scoreIncremented = false;
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipePassedBird = this.pipes[i].update(this.speed, this.bird.x, this.canvas.width);
      this.pipes[i].draw(this.ctx, this.canvas.height);
      
      // Remove pipes that are off screen
      if (this.pipes[i].x + this.pipes[i].width < 0) {
        this.pipes.splice(i, 1);
        continue;
      }
      
      // Check for collision
      if (this.pipes[i].checkCollision(this.bird)) {
        this.onGameOver();
        break;
      }
      
      // Increment score
      if (pipePassedBird) {
        scoreIncremented = true;
      }
    }
    
    // Add new pipe
    if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 200) {
      this.pipes.push(new PipeClass(this.canvas.width, this.canvas.height));
    }
    
    // Update and draw bird
    this.bird.update(this.gravity, this.canvas.height, this.frameCount, this.onGameOver);
    this.bird.draw(this.ctx);
    
    // Draw score
    ScoreUI({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      score: this.score
    });
    
    // Call score update in parent component
    if (scoreIncremented) {
      // We don't have direct access to updateScore, so we'll handle score in the parent component
      this.onJump(); // This is a hack to trigger a state update in the parent
    }
  }
  
  renderGameOverState() {
    // Draw game elements in background
    Background({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      clouds: this.clouds
    });
    
    for (const pipe of this.pipes) {
      pipe.draw(this.ctx, this.canvas.height);
    }
    
    this.bird.draw(this.ctx);
    
    // Draw game over overlay
    GameOverScreen({
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      score: this.score
    });
  }
  
  cleanup() {
    cancelAnimationFrame(this.animationFrameId);
    this.cleanupEventListeners();
  }
}
